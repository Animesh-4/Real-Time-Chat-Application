import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import RoomList from './RoomList';
import ChatArea from './ChatArea';
import OnlineUsers from './OnlineUsers';
import CreateRoomModal from './CreateRoomModal';

const ChatDashboard = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { user, logout } = useAuth();
  const { loadRooms, currentRoom, error, clearError } = useChat();

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user?.username}
                  </h2>
                  <p className="text-sm text-green-600">Online</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {sidebarOpen && (
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {sidebarOpen && (
            <button
              onClick={() => setShowCreateRoom(true)}
              className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Room
            </button>
          )}
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-hidden">
          <RoomList sidebarOpen={sidebarOpen} />
        </div>

        {/* Online Users */}
        {sidebarOpen && (
          <div className="border-t border-gray-200">
            <OnlineUsers />
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <ChatArea />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No room selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a room from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <CreateRoomModal
          isOpen={showCreateRoom}
          onClose={() => setShowCreateRoom(false)}
        />
      )}
    </div>
  );
};

export default ChatDashboard;