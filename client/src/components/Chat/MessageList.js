import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = () => {
  const { messages, currentRoom, loadMessages } = useChat();
  const { user } = useAuth();
  const messagesContainerRef = useRef(null);

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSameUser = (currentMsg, prevMsg) => {
    return prevMsg && currentMsg.userId === prevMsg.userId;
  };

  const isWithinTimeThreshold = (currentMsg, prevMsg) => {
    if (!prevMsg) return false;
    const timeDiff = new Date(currentMsg.createdAt) - new Date(prevMsg.createdAt);
    return timeDiff < 60000; // 1 minute
  };

  const shouldShowAvatar = (message, index) => {
    const prevMessage = messages[index - 1];
    return !isSameUser(message, prevMessage) || !isWithinTimeThreshold(message, prevMessage);
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-1"
    >
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === user?.id;
        const showAvatar = shouldShowAvatar(message, index);
        const showTimestamp = showAvatar;

        return (
          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
                {!isCurrentUser && showAvatar ? (
                  <img
                    src={message.User?.avatar}
                    alt={message.User?.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {/* Username and Timestamp */}
                {showTimestamp && !isCurrentUser && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.User?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  } ${showAvatar ? '' : 'mt-1'}`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  
                  {/* Timestamp for current user messages */}
                  {isCurrentUser && showTimestamp && (
                    <p className="text-xs text-indigo-200 mt-1">
                      {formatTime(message.createdAt)}
                    </p>
                  )}
                  
                  {/* Edit indicator */}
                  {message.edited && (
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                      (edited)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;