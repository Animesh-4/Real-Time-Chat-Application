// Date and time utilities
export const formatTime = (date) => {
  if (!date) return '';
  
  const messageDate = new Date(date);
  const now = new Date();
  const isToday = messageDate.toDateString() === now.toDateString();
  
  if (isToday) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return 'Yesterday ' + messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  const isThisYear = messageDate.getFullYear() === now.getFullYear();
  
  if (isThisYear) {
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return messageDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now - targetDate;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

export const isToday = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  return targetDate.toDateString() === today.toDateString();
};

export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = new Date(date);
  return targetDate.toDateString() === yesterday.toDateString();
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Avatar utilities
export const generateAvatarUrl = (username, size = 100) => {
  const name = encodeURIComponent(username || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=ffffff&size=${size}&rounded=true`;
};

export const getAvatarUrl = (user, size = 100) => {
  if (user?.avatar) {
    return user.avatar;
  }
  return generateAvatarUrl(user?.username, size);
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    minLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return {
    isValid: usernameRegex.test(username),
    minLength: username.length >= 3,
    maxLength: username.length <= 20,
    validChars: /^[a-zA-Z0-9_]+$/.test(username)
  };
};

// Message utilities
export const shouldGroupMessages = (currentMsg, prevMsg, timeThreshold = 60000) => {
  if (!prevMsg || !currentMsg) return false;
  
  const isSameUser = currentMsg.userId === prevMsg.userId;
  const timeDiff = new Date(currentMsg.createdAt) - new Date(prevMsg.createdAt);
  const isWithinTimeThreshold = timeDiff < timeThreshold;
  
  return isSameUser && isWithinTimeThreshold;
};

export const processMessageContent = (content) => {
  if (!content) return '';
  
  // Basic URL detection and linkification
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
};

export const detectMentions = (content) => {
  if (!content) return [];
  
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

export const isImageFile = (filename) => {
  if (!filename) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(getFileExtension(filename));
};

export const isVideoFile = (filename) => {
  if (!filename) return false;
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  return videoExtensions.includes(getFileExtension(filename));
};

export const isAudioFile = (filename) => {
  if (!filename) return false;
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  return audioExtensions.includes(getFileExtension(filename));
};

// Theme and UI utilities
export const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getUserColor = (userId) => {
  // Generate consistent color based on user ID
  const colors = [
    'text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600',
    'text-purple-600', 'text-pink-600', 'text-indigo-600', 'text-teal-600'
  ];
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage:', error);
    return false;
  }
};

// Array utilities
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter(item => {
    const val = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};

// Debounce utility
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message === 'Network Error' ||
         !navigator.onLine;
};

// Notification utilities
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'not-supported';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'chat-notification',
      ...options
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
    
    return notification;
  }
  return null;
};

// Sound utilities
export const playNotificationSound = (volume = 0.3) => {
  try {
    const audio = new Audio('/notification.mp3'); // You'll need to add this file
    audio.volume = volume;
    audio.play().catch(e => console.log('Could not play notification sound:', e));
  } catch (error) {
    console.log('Notification sound not available:', error);
  }
};

// Clipboard utilities
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// URL utilities
export const createShareUrl = (roomId, roomName) => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    room: roomId,
    name: roomName
  });
  return `${baseUrl}/join?${params.toString()}`;
};

export const parseUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

// Device detection utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Performance utilities
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

export const createPerformanceMarker = (name) => {
  if (performance.mark) {
    performance.mark(name);
  }
};

export const measureBetweenMarkers = (startMark, endMark, measureName) => {
  if (performance.measure) {
    performance.measure(measureName, startMark, endMark);
    const measures = performance.getEntriesByName(measureName);
    return measures[measures.length - 1]?.duration || 0;
  }
  return 0;
};

// Default export with all utilities
export default {
  // Time utilities
  formatTime,
  formatRelativeTime,
  isToday,
  isYesterday,
  
  // String utilities
  truncateText,
  capitalizeFirst,
  generateInitials,
  
  // Avatar utilities
  generateAvatarUrl,
  getAvatarUrl,
  
  // Validation utilities
  validateEmail,
  validatePassword,
  validateUsername,
  
  // Message utilities
  shouldGroupMessages,
  processMessageContent,
  detectMentions,
  
  // File utilities
  formatFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  isAudioFile,
  
  // Theme utilities
  getRandomColor,
  getUserColor,
  
  // Storage utilities
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  
  // Array utilities
  uniqueBy,
  groupBy,
  
  // Function utilities
  debounce,
  throttle,
  
  // Error utilities
  getErrorMessage,
  isNetworkError,
  
  // Notification utilities
  requestNotificationPermission,
  showNotification,
  playNotificationSound,
  
  // Clipboard utilities
  copyToClipboard,
  
  // URL utilities
  createShareUrl,
  parseUrlParams,
  
  // Device utilities
  isMobile,
  isIOS,
  isAndroid,
  
  // Performance utilities
  measurePerformance,
  createPerformanceMarker,
  measureBetweenMarkers
};