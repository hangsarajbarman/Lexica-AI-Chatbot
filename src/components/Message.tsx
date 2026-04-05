import React, { useState, useEffect } from "react";
import { User, Sparkles, Copy, Check, Paperclip } from "lucide-react";
import { Message as MessageType } from "../types/chat";

interface MessageProps {
  message: MessageType;
  theme: "light" | "dark";
}

export const Message: React.FC<MessageProps> = ({ message, theme }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  // Enhanced typing animation effect for streaming messages
  useEffect(() => {
    if (message.isStreaming && !isUser) {
      setIsTyping(true);
      setDisplayedContent("");

      let index = 0;
      const content = message.content;

      const typeWriter = () => {
        if (index < content.length) {
          // Add multiple characters at once for faster typing
          const charsToAdd = Math.min(2, content.length - index);
          setDisplayedContent(content.slice(0, index + charsToAdd));
          index += charsToAdd;
          setTimeout(typeWriter, 15); // Faster typing speed
        } else {
          setIsTyping(false);
        }
      };

      typeWriter();
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [message.content, message.isStreaming, isUser]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // FIX: Create a block-scoped constant for the current match.
      // This ensures that the closure in `onClick` captures the correct, non-null value for this iteration.
      const currentMatch = match;

      // Add text before code block
      if (currentMatch.index > lastIndex) {
        parts.push(
          <span key={lastIndex} className="whitespace-pre-wrap">
            {content.slice(lastIndex, currentMatch.index)}
          </span>
        );
      }

      // Add code block
      parts.push(
        <div
          key={currentMatch.index}
          className={`my-4 rounded-xl overflow-hidden border ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } shadow-lg`}
        >
          <div
            className={`px-4 py-3 text-xs flex items-center justify-between ${
              theme === "dark"
                ? "bg-gray-800 text-gray-300 border-b border-gray-700"
                : "bg-gray-100 text-gray-600 border-b border-gray-200"
            }`}
          >
            <span className="font-medium">{currentMatch[1] || "code"}</span>
            <button
              onClick={() => navigator.clipboard.writeText(currentMatch[2])}
              className={`p-1.5 rounded-lg hover:bg-opacity-80 transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <Copy size={12} />
            </button>
          </div>
          <pre
            className={`p-4 overflow-x-auto text-sm ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <code>{currentMatch[2]}</code>
          </pre>
        </div>
      );

      lastIndex = currentMatch.index + currentMatch[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={lastIndex} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? (
      parts
    ) : (
      <span className="whitespace-pre-wrap">{content}</span>
    );
  };

  return (
    <div
      className={`group flex gap-6 p-8 transition-all duration-200 ${
        isUser
          ? theme === "dark"
            ? "bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-800/70 hover:to-gray-700/70"
            : "bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-50/70 hover:to-indigo-50/70"
          : theme === "dark"
          ? "bg-gradient-to-r from-gray-900/50 to-gray-800/50 hover:from-gray-900/70 hover:to-gray-800/70"
          : "bg-gradient-to-r from-white/50 to-gray-50/50 hover:from-white/70 hover:to-gray-50/70"
      } backdrop-blur-sm border-b ${
        theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : theme === "dark"
            ? "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
            : "bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600"
        }`}
      >
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Sparkles size={20} className="text-white" />
        )}
      </div>

      <div
        className={`flex-1 ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {/* File attachments */}
        {message.files && message.files.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {message.files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              return (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden border shadow-md ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                >
                  {isImage ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="max-w-xs max-h-48 object-cover"
                      />
                    </a>
                  ) : (
                    <a
                      href={file.url}
                      download={file.name}
                      className={`flex items-center gap-3 p-4 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"} transition-colors`}
                    >
                      <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                        <Paperclip size={16} />
                      </div>
                      <div>
                        <div className="font-medium truncate max-w-xs">{file.name}</div>
                        <div className="text-xs opacity-70">{file.type}</div>
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="prose prose-sm max-w-none">
          {formatContent(displayedContent)}
          {isTyping && (
            <span
              className={`inline-block w-0.5 h-5 ml-1 animate-pulse ${
                theme === "dark" ? "bg-purple-400" : "bg-purple-600"
              }`}
            />
          )}
        </div>

        {!isUser && (
          <button
            onClick={copyToClipboard}
            className={`opacity-0 group-hover:opacity-100 mt-4 p-2 rounded-lg transition-all duration-200 ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            } ${copied ? "opacity-100" : ""}`}
          >
            {copied ? (
              <div className="flex items-center gap-2 text-green-500">
                <Check size={16} />
                <span className="text-sm">Copied!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Copy size={16} />
                <span className="text-sm">Copy</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
