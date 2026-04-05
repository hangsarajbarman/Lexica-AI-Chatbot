import React, { useState, useRef, useEffect } from "react";
import { Send, Plus, Paperclip, Image, X } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  isTyping: boolean;
  theme: "light" | "dark";
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isTyping,
  theme,
}) => {
  const [message, setMessage] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow sending if there's a message OR if there are files attached
    if ((message.trim() || selectedFiles.length > 0) && !isTyping) {
      onSendMessage(message, selectedFiles);
      setMessage("");
      setSelectedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowAttachMenu(false);
    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowAttachMenu(false);
    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  // Close attach menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAttachMenu &&
        attachMenuRef.current &&
        !attachMenuRef.current.contains(event.target as Node)
      ) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAttachMenu]);

  return (
    <div
      className={`relative border-t backdrop-blur-sm ${
        theme === "dark"
          ? "border-gray-700/50 bg-gray-800/80"
          : "border-gray-200/50 bg-white/80"
      }`}
    >
      {/* File attachments preview */}
      {selectedFiles.length > 0 && (
        <div
          className={`p-4 border-b ${
            theme === "dark" ? "border-gray-600/50" : "border-gray-200/50"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm shadow-sm ${
                  theme === "dark"
                    ? "bg-gray-700/80 text-gray-300 border border-gray-600"
                    : "bg-gray-100/80 text-gray-700 border border-gray-200"
                }`}
              >
                <span className="truncate max-w-32">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100/20 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div
          className={`relative flex items-end gap-3 rounded-3xl border-2 transition-all duration-200 ${
            theme === "dark"
              ? "border-gray-600/50 bg-gray-700/50 focus-within:border-purple-500/50 focus-within:bg-gray-700/80"
              : "border-gray-200/50 bg-gray-50/50 focus-within:border-purple-500/50 focus-within:bg-white/80"
          } focus-within:shadow-xl focus-within:shadow-purple-500/10`}
        >
          {/* Attach Button with Menu */}
          <div className="relative" ref={attachMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`flex-shrink-0 p-3 m-2 rounded-2xl transition-all duration-200 ${
                showAttachMenu
                  ? "bg-purple-500 text-white shadow-lg"
                  : theme === "dark"
                  ? "bg-gray-600/80 hover:bg-gray-500 text-gray-300 hover:shadow-lg"
                  : "bg-gray-200/80 hover:bg-gray-300 text-gray-600 hover:shadow-lg"
              }`}
            >
              <Plus
                size={20}
                className={showAttachMenu ? "rotate-45" : ""}
                style={{ transition: "transform 0.2s" }}
              />
            </button>

            {/* Attachment Menu - Fixed positioning and z-index */}
            {showAttachMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowAttachMenu(false)}
                />

                {/* Menu */}
                <div
                  className={`absolute bottom-full left-0 mb-2 rounded-2xl shadow-2xl border backdrop-blur-sm z-[101] min-w-[200px] ${
                    theme === "dark"
                      ? "bg-gray-800/98 border-gray-600"
                      : "bg-white/98 border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-opacity-80 transition-colors rounded-t-2xl ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Paperclip size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      Attach files
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={`flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-opacity-80 transition-colors rounded-b-2xl ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Image size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      Upload image
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTyping ? "Lexica is thinking..." : "Ask Lexica anything..."
            }
            disabled={isTyping}
            className={`flex-1 resize-none border-0 bg-transparent p-4 focus:outline-none max-h-32 min-h-[52px] text-lg ${
              theme === "dark"
                ? "text-white placeholder-gray-400"
                : "text-gray-900 placeholder-gray-500"
            }`}
            rows={1}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!(message.trim() || selectedFiles.length > 0)) || isTyping}
            className={`flex-shrink-0 p-3 m-2 rounded-2xl transition-all duration-200 ${
              (message.trim() || selectedFiles.length > 0) && !isTyping
                ? "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : theme === "dark"
                ? "bg-gray-600/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={handleImageSelect}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
