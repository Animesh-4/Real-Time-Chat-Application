import { requestNotificationPermission, showNotification, playNotificationSound } from './index';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from './constants';

class NotificationManager {
  constructor() {
    this.permission = Notification.permission;
    this.settings = this.loadSettings();
    this.init();
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const settings = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS.notifications, ...settings.notifications };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    return DEFAULT_SETTINGS.notifications;
  }

  saveSettings(settings) {
    try {
      const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
      currentSettings.notifications = { ...this.settings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(currentSettings));
      this.settings = currentSettings.notifications;
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  async init() {
    if (this.settings.enabled) {
      this.permission = await requestNotificationPermission();
    }
  }

  async requestPermission() {
    this.permission = await requestNotificationPermission();
    return this.permission;
  }

  canShowNotifications() {
    return this.settings.enabled && 
           this.permission === 'granted' && 
           document.hidden; // Only show when tab is not active
  }

  showMessageNotification(message, room, sender) {
    if (!this.canShowNotifications()) return null;

    const title = `${sender.username} in ${room.name}`;
    const options = {
      body: message.content,
      icon: sender.avatar || '/default-avatar.png',
      badge: '/favicon.ico',
      tag: `message-${room.id}`,
      data: {
        roomId: room.id,
        messageId: message.id,
        type: 'message'
      },
      actions: [
        {
          action: 'reply',
          title: 'Reply'
        },
        {
          action: 'view',
          title: 'View'
        }
      ]
    };

    const notification = showNotification(title, options);

    if (notification) {
      notification.onclick = () => {
        window.focus();
        // Navigate to room (you'll need to implement this based on your routing)
        window.location.href = `/chat?room=${room.id}`;
        notification.close();
      };

      if (this.settings.sound) {
        playNotificationSound();
      }
    }

    return notification;
  }

  showMentionNotification(message, room, sender) {
    if (!this.canShowNotifications() || !this.settings.mentions) return null;

    const title = `${sender.username} mentioned you in ${room.name}`;
    const options = {
      body: message.content,
      icon: sender.avatar || '/default-avatar.png',
      badge: '/favicon.ico',
      tag: `mention-${room.id}`,
      requireInteraction: true, // Keep notification visible until user interacts
      data: {
        roomId: room.id,
        messageId: message.id,
        type: 'mention'
      }
    };

    const notification = showNotification(title, options);

    if (notification) {
      notification.onclick = () => {
        window.focus();
        window.location.href = `/chat?room=${room.id}#message-${message.id}`;
        notification.close();
      };

      if (this.settings.sound) {
        playNotificationSound(0.5); // Slightly louder for mentions
      }
    }

    return notification;
  }

  showSystemNotification(title, message, options = {}) {
    if (!this.canShowNotifications()) return null;

    const notificationOptions = {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'system',
      ...options
    };

    return showNotification(title, notificationOptions);
  }

  showJoinNotification(user, room) {
    if (!this.canShowNotifications()) return null;

    return this.showSystemNotification(
      `${user.username} joined ${room.name}`,
      'New member in the room',
      {
        icon: user.avatar,
        tag: `join-${room.id}`
      }
    );
  }

  showLeaveNotification(user, room) {
    if (!this.canShowNotifications()) return null;

    return this.showSystemNotification(
      `${user.username} left ${room.name}`,
      'Member left the room',
      {
        icon: user.avatar,
        tag: `leave-${room.id}`
      }
    );
  }

  // Update notification settings
  updateSettings(newSettings) {
    this.saveSettings(newSettings);
    
    // If notifications were disabled, we might need to request permission again later
    if (newSettings.enabled && this.permission !== 'granted') {
      this.requestPermission();
    }
  }

  // Clear all notifications with specific tag
  clearNotifications(tag) {
    if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications({ tag }).then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }

  // Clear all notifications
  clearAllNotifications() {
    if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }

  // Get current settings
  getSettings() {
    return { ...this.settings };
  }

  // Check if browser supports notifications
  isSupported() {
    return 'Notification' in window;
  }

  // Get permission status
  getPermissionStatus() {
    return this.permission;
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

export default notificationManager;

// Export convenience functions
export const showMessageNotification = (message, room, sender) => 
  notificationManager.showMessageNotification(message, room, sender);

export const showMentionNotification = (message, room, sender) => 
  notificationManager.showMentionNotification(message, room, sender);

export const showSystemNotification = (title, message, options) => 
  notificationManager.showSystemNotification(title, message, options);

export const updateNotificationSettings = (settings) => 
  notificationManager.updateSettings(settings);

export const clearNotifications = (tag) => 
  notificationManager.clearNotifications(tag);

export const getNotificationSettings = () => 
  notificationManager.getSettings();

