import React from 'react';
import { MessageSquare, Trash2, Sparkles } from 'lucide-react';
import { Conversation } from '../types/chat';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  theme: 'light' | 'dark';
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  theme
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`group relative flex items-center gap-3 p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
            conversation.id === currentConversationId
              ? theme === 'dark' 
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 shadow-lg' 
                : 'bg-gradient-to-r from-purple-100/50 to-blue-100/50 border border-purple-300/50 shadow-lg'
              : theme === 'dark' 
                ? 'hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50' 
                : 'hover:bg-gray-100/50 border border-transparent hover:border-gray-200/50'
          }`}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            conversation.id === currentConversationId
              ? 'bg-gradient-to-br from-purple-500 to-blue-500'
              : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <MessageSquare size={16} className={
              conversation.id === currentConversationId 
                ? 'text-white' 
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            } />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`block truncate text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {conversation.title}
            </span>
            <span className={`block text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {conversation.messages.length} messages
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
            className={`opacity-0 group-hover:opacity-100 p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
              theme === 'dark' 
                ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-100/50 text-gray-500 hover:text-red-500'
            }`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {conversations.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20' 
              : 'bg-gradient-to-br from-purple-100 to-blue-100'
          }`}>
            <Sparkles size={32} className="opacity-50" />
          </div>
          <p className="text-sm font-medium mb-1">No conversations yet</p>
          <p className="text-xs">Start a new chat to begin your journey</p>
        </div>
      )}
    </div>
  );
};