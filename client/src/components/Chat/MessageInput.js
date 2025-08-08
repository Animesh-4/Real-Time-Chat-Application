import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentRoom, sendMessage, startTyping, stopTyping } = useChat();
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }

    // Handle typing indicators
    if (value.trim() && !isTyping && currentRoom) {
      setIsTyping(true);
      startTyping(currentRoom.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping && currentRoom) {
          setIsTyping(false);
          stopTyping(currentRoom.id);
        }
      }, 1000);
    } else if (isTyping && currentRoom) {
      setIsTyping(false);
      stopTyping(currentRoom.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !currentRoom) {
      return;
    }

    // Send message
    sendMessage({
      roomId: currentRoom.id,
      content: message.trim(),
      type: 'text'
    });

    // Clear input and stop typing
    setMessage('');
    if (isTyping) {
      setIsTyping(false);
      stopTyping(currentRoom.id);
    }
    
    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleBlur = () => {
    // Stop typing when input loses focus
    if (isTyping && currentRoom) {
      setIsTyping(false);
      stopTyping(currentRoom.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end space-x-3">
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={currentRoom ? "Type a message..." : "Select a room to start chatting"}
              rows={1}
              disabled={!currentRoom}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none max-h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ minHeight: '48px' }}
            />
            
            {/* Character count (optional) */}
            {message.length > 800 && (
              <div className="absolute bottom-1 right-12 text-xs text-gray-500">
                {message.length}/1000
              </div>
            )}
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || !currentRoom}
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
            title="Send message (Enter)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {/* File Upload Button (for future implementation) */}
        <div className="flex items-center mt-2 space-x-2">
          <button
            type="button"
            disabled={!currentRoom}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file (Coming soon)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button
            type="button"
            disabled={!currentRoom}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send emoji (Coming soon)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;