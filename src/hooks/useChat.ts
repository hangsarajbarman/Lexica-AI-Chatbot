import { useState, useCallback, useEffect } from "react";
import { ChatState, Conversation, Message } from "../types/chat";
import { openAIService } from "../utils/openai";
import { getLanguageName } from "../utils/languages";

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isTyping: false,
  theme: "dark",
  language: "en",
  apiKey: "",
  model: "gpt-4o-mini",
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem("lexica-ai-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialState,
          ...parsed,
          conversations:
            parsed.conversations?.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages:
                conv.messages?.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                })) || [],
            })) || [],
        };
      } catch (error) {
        console.error("Failed to parse saved state:", error);
      }
    }
    return initialState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("lexica-ai-state", JSON.stringify(state));
  }, [state]);

  // Initialize OpenAI service when API key changes
  useEffect(() => {
    if (state.apiKey) {
      openAIService.initialize(state.apiKey);
    }
  }, [state.apiKey]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
      currentConversationId: newConversation.id,
    }));

    return newConversation.id;
  }, []);

  const generateTitle = (message: string): string => {
    const words = message.split(" ").slice(0, 6);
    return words.join(" ") + (message.split(" ").length > 6 ? "..." : "");
  };

  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      const trimmedContent = content.trim();
      const hasFiles = !!(files && files.length > 0);
      const hasText = trimmedContent.length > 0;

      // Allow sending if there's content OR files
      if (!hasText && !hasFiles) return;
      if (!state.apiKey) {
        alert("Please set your OpenAI API key in settings first.");
        return;
      }

      let conversationId = state.currentConversationId;

      // Create new conversation if none exists
      if (!conversationId) {
        conversationId = createNewConversation();
      }

      // Process files if any
      let fileAttachments;
      if (files && files.length > 0) {
        fileAttachments = await Promise.all(
          files.map(async (file) => {
            // Create a URL for the file
            const url = URL.createObjectURL(file);
            return {
              name: file.name,
              type: file.type,
              url: url,
            };
          })
        );
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content: trimmedContent,
        role: "user",
        timestamp: new Date(),
        files: fileAttachments,
      };

      // Add user message
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                title:
                  conv.messages.length === 0 && hasText
                    ? generateTitle(trimmedContent)
                    : conv.title,
                updatedAt: new Date(),
              }
            : conv
        ),
        isTyping: hasText,
      }));

      if (!hasText) {
        return;
      }

      try {
        // Prepare messages for OpenAI
        const conversation = state.conversations.find(
          (conv) => conv.id === conversationId
        );
        const messages = conversation
          ? [...conversation.messages, userMessage]
          : [userMessage];

        // Add system message for language if not English
        const systemMessages = [];
        if (state.language !== "en") {
          systemMessages.push({
            role: "system",
            content: `Please respond in ${getLanguageName(
              state.language
            )}. If the user writes in a different language, still respond in ${getLanguageName(
              state.language
            )}.`,
          });
        }

        const openAIMessages = [
          ...systemMessages,
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ];

        // Create assistant message for streaming
        const assistantMessageId = (Date.now() + 1).toString();
        let assistantContent = "";

        // Add empty assistant message
        setState((prev) => ({
          ...prev,
          conversations: prev.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      id: assistantMessageId,
                      content: "",
                      role: "assistant" as const,
                      timestamp: new Date(),
                      isStreaming: true,
                    },
                  ],
                  updatedAt: new Date(),
                }
              : conv
          ),
          isTyping: false,
        }));

        // Stream the response
        const stream = openAIService.streamChatCompletion(
          openAIMessages,
          state.model
        );

        for await (const chunk of stream) {
          assistantContent += chunk;

          setState((prev) => ({
            ...prev,
            conversations: prev.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: conv.messages.map((msg) =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: assistantContent,
                            isStreaming: true,
                          }
                        : msg
                    ),
                    updatedAt: new Date(),
                  }
                : conv
            ),
          }));
        }

        // Mark streaming as complete
        setState((prev) => ({
          ...prev,
          conversations: prev.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, isStreaming: false }
                      : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }));
      } catch (error: any) {
        console.error("Error sending message:", error);

        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            error.message ||
            "Sorry, I encountered an error. Please check your API key and try again.",
          role: "assistant",
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          conversations: prev.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, errorMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
          isTyping: false,
        }));
      }
    },
    [
      state.currentConversationId,
      state.apiKey,
      state.model,
      state.language,
      state.conversations,
      createNewConversation,
    ]
  );

  const selectConversation = useCallback((conversationId: string) => {
    setState((prev) => ({
      ...prev,
      currentConversationId: conversationId,
    }));
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.filter(
        (conv) => conv.id !== conversationId
      ),
      currentConversationId:
        prev.currentConversationId === conversationId
          ? null
          : prev.currentConversationId,
    }));
  }, []);

  const resetChat = useCallback(() => {
    if (state.currentConversationId) {
      setState((prev) => ({
        ...prev,
        conversations: prev.conversations.map((conv) =>
          conv.id === state.currentConversationId
            ? { ...conv, messages: [] }
            : conv
        ),
      }));
    }
  }, [state.currentConversationId]);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const updateSettings = useCallback(
    (settings: { apiKey: string; model: string; language: string }) => {
      setState((prev) => ({
        ...prev,
        ...settings,
      }));
    },
    []
  );

  const getCurrentConversation = useCallback(() => {
    return (
      state.conversations.find(
        (conv) => conv.id === state.currentConversationId
      ) || null
    );
  }, [state.conversations, state.currentConversationId]);

  return {
    ...state,
    sendMessage,
    createNewConversation,
    selectConversation,
    deleteConversation,
    resetChat,
    toggleTheme,
    updateSettings,
    getCurrentConversation,
  };
};
