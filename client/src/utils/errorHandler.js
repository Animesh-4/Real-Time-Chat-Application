import { getErrorMessage, isNetworkError } from './index';
import { ERROR_CODES } from './constants';

class ErrorHandler {
  constructor() {
    this.errorHandlers = new Map();
    this.setupDefaultHandlers();
  }

  setupDefaultHandlers() {
    // Network error handler
    this.register('NETWORK_ERROR', (error) => {
      console.error('Network Error:', error);
      return {
        message: 'Network connection failed. Please check your internet connection.',
        type: 'network',
        retry: true
      };
    });

    // Authentication error handler
    this.register(ERROR_CODES.UNAUTHORIZED, (error) => {
      console.error('Authentication Error:', error);
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      
      return {
        message: 'Your session has expired. Please login again.',
        type: 'auth',
        retry: false
      };
    });

    // Forbidden error handler
    this.register(ERROR_CODES.FORBIDDEN, (error) => {
      console.error('Forbidden Error:', error);
      return {
        message: 'You do not have permission to perform this action.',
        type: 'permission',
        retry: false
      };
    });

    // Not found error handler
    this.register(ERROR_CODES.NOT_FOUND, (error) => {
      console.error('Not Found Error:', error);
      return {
        message: 'The requested resource was not found.',
        type: 'notFound',
        retry: false
      };
    });

    // Validation error handler
    this.register(ERROR_CODES.VALIDATION_ERROR, (error) => {
      console.error('Validation Error:', error);
      const details = error.response?.data?.errors || [];
      return {
        message: getErrorMessage(error),
        type: 'validation',
        retry: false,
        details
      };
    });

    // Server error handler
    this.register(ERROR_CODES.SERVER_ERROR, (error) => {
      console.error('Server Error:', error);
      return {
        message: 'A server error occurred. Please try again later.',
        type: 'server',
        retry: true
      };
    });
  }

  register(errorCode, handler) {
    this.errorHandlers.set(errorCode, handler);
  }

  handle(error) {
    let errorCode;
    
    if (isNetworkError(error)) {
      errorCode = 'NETWORK_ERROR';
    } else if (error.response?.status) {
      errorCode = error.response.status;
    } else {
      errorCode = 'UNKNOWN';
    }

    const handler = this.errorHandlers.get(errorCode) || this.defaultHandler;
    return handler(error);
  }

  defaultHandler(error) {
    console.error('Unhandled Error:', error);
    return {
      message: getErrorMessage(error) || 'An unexpected error occurred.',
      type: 'unknown',
      retry: true
    };
  }

  // Specific error handling methods
  handleSocketError(error) {
    console.error('Socket Error:', error);
    return {
      message: 'Connection to chat server lost. Reconnecting...',
      type: 'socket',
      retry: true
    };
  }

  handleFileUploadError(error) {
    console.error('File Upload Error:', error);
    
    if (error.code === 'FILE_TOO_LARGE') {
      return {
        message: 'File is too large. Maximum size is 10MB.',
        type: 'fileSize',
        retry: false
      };
    }
    
    if (error.code === 'INVALID_FILE_TYPE') {
      return {
        message: 'File type not supported.',
        type: 'fileType',
        retry: false
      };
    }
    
    return {
      message: 'Failed to upload file. Please try again.',
      type: 'upload',
      retry: true
    };
  }

  handleAuthError(error) {
    console.error('Auth Error:', error);
    
    // Clear stored auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return {
      message: 'Authentication failed. Please login again.',
      type: 'auth',
      retry: false,
      redirect: '/login'
    };
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export helper functions
export const handleError = (error) => errorHandler.handle(error);
export const handleSocketError = (error) => errorHandler.handleSocketError(error);
export const handleFileUploadError = (error) => errorHandler.handleFileUploadError(error);
export const handleAuthError = (error) => errorHandler.handleAuthError(error);
export const registerErrorHandler = (code, handler) => errorHandler.register(code, handler);

export default errorHandler;