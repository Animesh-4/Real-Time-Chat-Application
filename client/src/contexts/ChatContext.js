import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { chatAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'ADD_ROOM':
      return { ...state, rooms: [action.payload, ...state.rooms] };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'UPDATE_USER_ONLINE':
      return {
        ...state,
        onlineUsers: state.onlineUsers.some(u => u.id === action.payload.userId)
          ? state.onlineUsers
          : [...state.onlineUsers, action.payload]
      };
    case 'UPDATE_USER_OFFLINE':
      return {
        ...state,
        onlineUsers: state.onlineUsers.filter(u => u.id !== action.payload.userId)
      };
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload };
    case 'ADD_TYPING_USER':
      return {
        ...state,
        typingUsers: state.typingUsers.includes(action.payload)
          ? state.typingUsers
          : [...state.typingUsers, action.payload]
      };
    case 'REMOVE_TYPING_USER':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(user => user !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  loading: false,
  error: null
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Setup socket listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const setupSocketListeners = () => {
      // Message listeners
      socketService.onNewMessage((message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
      });

      // Online status listeners
      socketService.onUserOnline((user) => {
        dispatch({ type: 'UPDATE_USER_ONLINE', payload: user });
      });

      socketService.onUserOffline((data) => {
        dispatch({ type: 'UPDATE_USER_OFFLINE', payload: data });
      });

      socketService.onOnlineUsers((users) => {
        dispatch({ type: 'SET_ONLINE_USERS', payload: users });
      });

      // Typing listeners
      socketService.onUserTyping((data) => {
        dispatch({ type: 'ADD_TYPING_USER', payload: data.username });
        // Auto remove after 3 seconds
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TYPING_USER', payload: data.username });
        }, 3000);
      });

      socketService.onUserStoppedTyping((data) => {
        dispatch({ type: 'REMOVE_TYPING_USER', payload: data.username });
      });

      // Error listener
      socketService.onError((error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      });
    };

    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, [isAuthenticated]);

  const loadRooms = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await chatAPI.getRooms();
      dispatch({ type: 'SET_ROOMS', payload: response.data.rooms });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to load rooms' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMessages = async (roomId, page = 1) => {
    try {
      const response = await chatAPI.getMessages(roomId, page);
      if (page === 1) {
        dispatch({ type: 'SET_MESSAGES', payload: response.data.messages });
      } else {
        dispatch({ 
          type: 'SET_MESSAGES', 
          payload: [...response.data.messages, ...state.messages] 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to load messages' 
      });
    }
  };

  const createRoom = async (roomData) => {
    try {
      const response = await chatAPI.createRoom(roomData);
      dispatch({ type: 'ADD_ROOM', payload: response.data.room });
      return { success: true, room: response.data.room };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create room';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const joinRoom = async (roomId) => {
    try {
      await chatAPI.joinRoom(roomId);
      socketService.joinRoom(roomId);
      
      // Find and set current room
      const room = state.rooms.find(r => r.id === roomId);
      if (room) {
        dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
        await loadMessages(roomId);
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to join room';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const leaveRoom = (roomId) => {
    socketService.leaveRoom(roomId);
    if (state.currentRoom?.id === roomId) {
      dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
      dispatch({ type: 'SET_MESSAGES', payload: [] });
    }
  };

  const sendMessage = (messageData) => {
    socketService.sendMessage(messageData);
  };

  const startTyping = (roomId) => {
    socketService.startTyping(roomId);
  };

  const stopTyping = (roomId) => {
    socketService.stopTyping(roomId);
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    loadRooms,
    loadMessages,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    clearError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};