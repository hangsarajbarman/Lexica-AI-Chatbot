import React, { useState } from 'react';
import { Plus, Menu, Sun, Moon, X, Settings, Download, RotateCcw, Sparkles, Search } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { Conversation } from '../types/chat';
import { exportToPDF } from '../utils/pdfExport';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onResetChat: () => void;
  theme: 'light' | 'dark';
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onToggleTheme,
  onOpenSettings,
  onResetChat,
  theme
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportPDF = () => {
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    if (currentConversation && currentConversation.messages.length > 0) {
      exportToPDF(currentConversation.messages, currentConversation.title);
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.messages.some(message => 
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    } backdrop-blur-sm`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-600/30">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
              : 'bg-gradient-to-br from-purple-500 to-blue-500'
          } shadow-lg`}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Lexica
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              AI Assistant
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed transition-all duration-200 hover:scale-105 mb-4 ${
            theme === 'dark' 
              ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50' 
              : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Plus size={16} />
          </div>
          <span className="text-sm font-medium">New conversation</span>
        </button>

        {/* Search Conversations */}
        <div className={`relative rounded-2xl border transition-all duration-200 ${
          theme === 'dark' 
            ? 'border-gray-600/50 bg-gray-700/50 focus-within:border-purple-500/50' 
            : 'border-gray-200/50 bg-gray-50/50 focus-within:border-purple-500/50'
        }`}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className={`w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:outline-none text-sm ${
              theme === 'dark' 
                ? 'text-white placeholder-gray-400' 
                : 'text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Conversations */}
      <ConversationList
        conversations={filteredConversations}
        currentConversationId={currentConversationId}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
        theme={theme}
      />

      {/* Footer */}
      <div className={`p-4 border-t space-y-2 ${
        theme === 'dark' ? 'border-gray-600/30' : 'border-gray-300/30'
      }`}>
        {/* Action Buttons */}
        {[
          { icon: RotateCcw, label: 'Reset Chat', onClick: onResetChat, color: 'from-orange-500 to-red-500' },
          { 
            icon: Download, 
            label: 'Export PDF', 
            onClick: handleExportPDF,
            disabled: !currentConversationId || conversations.find(c => c.id === currentConversationId)?.messages.length === 0,
            color: 'from-green-500 to-emerald-500'
          },
          { icon: Settings, label: 'Settings', onClick: onOpenSettings, color: 'from-blue-500 to-cyan-500' },
        ].map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              action.disabled
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark' 
                ? 'hover:bg-gray-700/50 hover:scale-105' 
                : 'hover:bg-gray-100/50 hover:scale-105'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${action.color}`}>
              <action.icon size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
            theme === 'dark' ? 'hover:bg-gray-700/50 hover:scale-105' : 'hover:bg-gray-100/50 hover:scale-105'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-500'
          }`}>
            {theme === 'dark' ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
          </div>
          <span className="text-sm font-medium">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`md:hidden fixed top-6 left-6 z-30 p-3 rounded-2xl shadow-2xl backdrop-blur-sm ${
          theme === 'dark' 
            ? 'bg-gray-800/90 text-white border border-gray-700' 
            : 'bg-white/90 text-gray-900 border border-gray-200'
        }`}
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-80 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-80 flex-shrink-0">
            <SidebarContent />
          </div>
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 p-3 text-white bg-gray-800/80 rounded-2xl backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};