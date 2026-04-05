import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { SettingsModal } from "./components/SettingsModal";
import { useChat } from "./hooks/useChat";

function App() {
  const [showSettings, setShowSettings] = useState(false);

  const {
    conversations,
    currentConversationId,
    isTyping,
    theme,
    language,
    apiKey,
    model,
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
    resetChat,
    toggleTheme,
    updateSettings,
    getCurrentConversation,
  } = useChat();

  const currentConversation = getCurrentConversation();

  return (
    <div
      className={`h-screen flex ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setShowSettings(true)}
        onResetChat={resetChat}
        theme={theme}
      />
      <ChatArea
        currentConversation={currentConversation}
        isTyping={isTyping}
        onSendMessage={sendMessage}
        theme={theme}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        model={model}
        language={language}
        theme={theme}
        onSaveSettings={updateSettings}
      />
    </div>
  );
}

export default App;
