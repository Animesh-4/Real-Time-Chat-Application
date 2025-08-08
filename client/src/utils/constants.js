// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Rooms
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  USER_JOINED_ROOM: 'userJoinedRoom',
  USER_LEFT_ROOM: 'userLeftRoom',
  
  // Messages
  SEND_MESSAGE: 'sendMessage',
  NEW_MESSAGE: 'newMessage',
  MESSAGE_EDITED: 'messageEdited',
  MESSAGE_DELETED: 'messageDeleted',
  
  // Typing
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  USER_TYPING: 'userTyping',
  USER_STOPPED_TYPING: 'userStoppedTyping',
  
  // User Status
  USER_ONLINE: 'userOnline',
  USER_OFFLINE: 'userOffline',
  ONLINE_USERS: 'onlineUsers',
  
  // Errors
  ERROR: 'error'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Room Types
export const ROOM_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  DIRECT: 'direct'
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    VIDEOS: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    AUDIO: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
    DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    ARCHIVES: ['zip', 'rar', '7z', 'tar', 'gz']
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  ROOM_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50
  },
  MESSAGE: {
    MAX_LENGTH: 1000
  }
};

// UI Constants
export const UI_CONSTANTS = {
  MESSAGE_LOAD_LIMIT: 50,
  TYPING_TIMEOUT: 3000, // 3 seconds
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  SIDEBAR_BREAKPOINT: 768 // px
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: 'indigo',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue'
};

// Status Colors
export const STATUS_COLORS = {
  ONLINE: 'bg-green-400',
  AWAY: 'bg-yellow-400',
  BUSY: 'bg-red-400',
  OFFLINE: 'bg-gray-400'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  MENTION: 'mention',
  ROOM_INVITE: 'room_invite',
  SYSTEM: 'system'
};

// Error Codes
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 'NETWORK_ERROR'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SETTINGS: 'settings',
  DRAFT_MESSAGES: 'draftMessages',
  NOTIFICATION_PERMISSION: 'notificationPermission'
};

// Default Settings
export const DEFAULT_SETTINGS = {
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    mentions: true
  },
  theme: 'light',
  language: 'en',
  autoJoinRooms: true,
  showTypingIndicators: true,
  groupMessages: true,
  compactMode: false
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHAT: '/chat',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ROOM: '/room/:id',
  JOIN: '/join'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  URL: /(https?:\/\/[^\s]+)/g,
  EMAIL: /\S+@\S+\.\S+/g,
  MENTION: /@(\w+)/g,
  HASHTAG: /#(\w+)/g,
  PHONE: /(\+\d{1,3}[- ]?)?\d{10}/g
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Feature Flags
export const FEATURES = {
  VOICE_MESSAGES: false,
  VIDEO_CALLS: false,
  SCREEN_SHARING: false,
  MESSAGE_REACTIONS: false,
  MESSAGE_THREADS: false,
  CUSTOM_EMOJIS: false,
  FILE_SHARING: true,
  IMAGE_SHARING: true,
  MENTIONS: true,
  TYPING_INDICATORS: true,
  READ_RECEIPTS: false,
  MESSAGE_SEARCH: false,
  MESSAGE_ENCRYPTION: false
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

export default {
  API_CONFIG,
  MESSAGE_TYPES,
  SOCKET_EVENTS,
  USER_ROLES,
  ROOM_TYPES,
  FILE_UPLOAD,
  VALIDATION_RULES,
  UI_CONSTANTS,
  THEME_COLORS,
  STATUS_COLORS,
  NOTIFICATION_TYPES,
  ERROR_CODES,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  ROUTES,
  REGEX_PATTERNS,
  ANIMATION_DURATION,
  FEATURES,
  BREAKPOINTS
};