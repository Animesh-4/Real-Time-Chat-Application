import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = () => {
  const { currentRoom, messages, typingUsers } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {currentRoom.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {currentRoom.name}
              </h1>
              <p className="text-sm text-gray-500">
                {currentRoom.Users?.length || 0} members
                {currentRoom.description && ` • ${currentRoom.description}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentRoom.isPrivate && (
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">Private</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <MessageList />
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="px-6 py-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers.slice(-1)} are typing...`
                }
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatArea;