import React, { useState } from 'react';
import { X, Settings, Key, Globe, Cpu, Eye, EyeOff } from 'lucide-react';
import { languages } from '../utils/languages';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  model: string;
  language: string;
  theme: 'light' | 'dark';
  onSaveSettings: (settings: { apiKey: string; model: string; language: string }) => void;
}

const models = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient', color: 'from-green-500 to-emerald-500' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model', color: 'from-purple-500 to-indigo-500' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Advanced reasoning', color: 'from-blue-500 to-cyan-500' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Quick responses', color: 'from-orange-500 to-red-500' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  model,
  language,
  theme,
  onSaveSettings,
}) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(model);
  const [localLanguage, setLocalLanguage] = useState(language);
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      apiKey: localApiKey,
      model: localModel,
      language: localLanguage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl border ${
        theme === 'dark' 
          ? 'bg-gray-800/95 text-white border-gray-700' 
          : 'bg-white/95 text-gray-900 border-gray-200'
      } backdrop-blur-sm max-h-[90vh] overflow-y-auto`}>
        <div className={`flex items-center justify-between p-8 border-b ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Configure your Lexica experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* API Key */}
          <div>
            <label className="flex items-center gap-3 text-lg font-semibold mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Key size={16} className="text-white" />
              </div>
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your API key"
                className={`w-full p-4 pr-16 rounded-2xl border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                    : 'bg-gray-50/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className={`text-sm mt-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              🔒 Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="flex items-center gap-3 text-lg font-semibold mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              AI Model
            </label>
            <div className="grid grid-cols-1 gap-3">
              {models.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    localModel === m.id
                      ? theme === 'dark'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-500 bg-purple-50'
                      : theme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.id}
                    checked={localModel === m.id}
                    onChange={(e) => setLocalModel(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <Cpu size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{m.name}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {m.description}
                    </div>
                  </div>
                  {localModel === m.id && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-3 text-lg font-semibold mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Globe size={16} className="text-white" />
              </div>
              Language
            </label>
            <select
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-gray-50/50 border-gray-300 text-gray-900 focus:border-purple-500'
              } focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`flex gap-4 p-8 border-t ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-100/50 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};