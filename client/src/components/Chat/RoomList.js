import React from 'react';
import { useChat } from '../../contexts/ChatContext';

const RoomList = ({ sidebarOpen }) => {
  const { rooms, currentRoom, joinRoom, loading } = useChat();

  const handleRoomClick = async (room) => {
    if (currentRoom?.id !== room.id) {
      await joinRoom(room.id);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              {sidebarOpen && (
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {sidebarOpen && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Rooms ({rooms.length})
          </h3>
        </div>
      )}
      
      <div className="p-2">
        {rooms.length === 0 ? (
          sidebarOpen && (
            <div className="text-center py-8">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m-2-4h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No rooms available</p>
              <p className="text-xs text-gray-400">Create a room to get started</p>
            </div>
          )
        ) : (
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  currentRoom?.id === room.id
                    ? 'bg-indigo-100 border border-indigo-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    room.Users?.length > 0 ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  
                  {sidebarOpen ? (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {room.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(room.updatedAt)}
                        </span>
                      </div>
                      
                      {room.description && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {room.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {room.Users?.length || 0} members
                        </span>
                        
                        {room.isPrivate && (
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {room.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;