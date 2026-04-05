import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { Conversation } from '../types/chat';
import { Zap, Brain, MessageCircle } from 'lucide-react';

interface ChatAreaProps {
  currentConversation: Conversation | null;
  isTyping: boolean;
  onSendMessage: (message: string, files?: File[]) => void;
  theme: 'light' | 'dark';
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  currentConversation,
  isTyping,
  onSendMessage,
  theme
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isTyping]);

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-white via-purple-200 to-blue-200' 
              : 'from-gray-900 via-purple-700 to-blue-700'
          } bg-clip-text text-transparent`}>
            Welcome to Lexica
          </h1>
          
          <p className={`text-xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your intelligent AI companion for creative conversations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Brain, title: "Smart Analysis", desc: "Deep insights & reasoning", color: "from-purple-500 to-pink-500" },
            { icon: Zap, title: "Lightning Fast", desc: "Instant responses", color: "from-blue-500 to-cyan-500" },
            { icon: MessageCircle, title: "Natural Chat", desc: "Human-like conversations", color: "from-green-500 to-emerald-500" }
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                  : 'bg-white/80 border-gray-200 hover:bg-white shadow-sm'
              } backdrop-blur-sm`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Suggestion Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { text: "Explain quantum computing", icon: "🔬" },
            { text: "Write a Python function", icon: "💻" },
            { text: "Plan a trip to Japan", icon: "🗾" },
            { text: "Create a meal plan", icon: "🍽️" }
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion.text)}
              className={`group p-6 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-200 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white text-gray-700 border border-gray-200 shadow-sm'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{suggestion.icon}</span>
                <span className="font-medium group-hover:text-purple-500 transition-colors">
                  {suggestion.text}
                </span>
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Click to start conversation
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const TypingIndicator = () => (
    <div className={`flex gap-4 p-6 ${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/50'
    } backdrop-blur-sm`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
        theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'
      } shadow-lg`}>
        <Brain size={20} className="text-white" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full animate-bounce ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Lexica is thinking...
        </span>
      </div>
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col relative ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, purple 2px, transparent 2px), radial-gradient(circle at 75% 75%, blue 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative z-10">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {currentConversation.messages.map((message) => (
              <Message key={message.id} message={message} theme={theme} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <MessageInput 
        onSendMessage={onSendMessage} 
        isTyping={isTyping}
        theme={theme}
      />
    </div>
  );
};