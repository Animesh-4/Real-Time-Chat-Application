import React, { useEffect, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { chatAPI } from '../../services/api';

const OnlineUsers = () => {
  const { onlineUsers } = useChat();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Filter out current user from online users list
  const filteredOnlineUsers = onlineUsers.filter(user => user.id !== currentUser?.id);

  const getStatusColor = (user) => {
    return 'bg-green-400'; // All users in onlineUsers are online
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Unknown';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now - lastSeenDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeenDate.toLocaleDateString();
  };

  const refreshOnlineUsers = async () => {
    try {
      setLoading(true);
      await chatAPI.getOnlineUsers();
    } catch (error) {
      console.error('Failed to refresh online users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Online Users ({filteredOnlineUsers.length})
        </h3>
        <button
          onClick={refreshOnlineUsers}
          disabled={loading}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          title="Refresh online users"
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>
      
      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOnlineUsers.length === 0 ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" 
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No other users online</p>
            <p className="text-xs text-gray-300 mt-1">You're the only one here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOnlineUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                title={`${user.username} - Online`}
              >
                {/* Avatar with status indicator */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=ffffff`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=ffffff`;
                    }}
                  />
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(user)} border-2 border-white rounded-full`}
                    title="Online"
                  ></div>
                </div>
                
                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.username}
                    </p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">
                    Online
                  </p>
                </div>
                
                {/* Action button (for future features like direct message) */}
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded transition-all"
                  title="Send direct message (Coming soon)"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement direct messaging
                    console.log('Direct message to:', user.username);
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Current user info at bottom */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex items-center space-x-3 p-2 bg-indigo-50 rounded-lg">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.username || 'You')}&background=6366f1&color=ffffff`}
              alt="You"
              className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.username} (You)
            </p>
            <p className="text-xs text-green-600 font-medium">
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineUsers;