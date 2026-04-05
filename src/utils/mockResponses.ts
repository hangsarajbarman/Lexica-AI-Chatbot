const responses = [
  "I'm Claude, an AI assistant created by Anthropic. I'm designed to be helpful, harmless, and honest. How can I assist you today?",
  "That's an interesting question! Let me think about that...",
  "I'd be happy to help you with that. Here's what I think:",
  "Great question! Here are a few ways to approach this:",
  "I understand what you're asking. Let me break this down for you:",
  "That's a complex topic. Here's my perspective on it:",
  "I can definitely help with that. Here's what you need to know:",
  "Interesting point! Here's how I would approach this:",
  "I see what you mean. Let me explain this step by step:",
  "That's a good observation. Here's what I think about that:",
];

export const getMockResponse = (userMessage: string): string => {
  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
    return `Here's a simple example of what you're looking for:

\`\`\`javascript
function example() {
  console.log("Hello, World!");
  return "This is a code example";
}
\`\`\`

This demonstrates the basic structure. Would you like me to explain any specific part?`;
  }
  
  if (lowerMessage.includes('list') || lowerMessage.includes('steps')) {
    return `Here's a structured approach:

1. **First step**: Start with the basics and understand the fundamentals
2. **Second step**: Practice with simple examples to build confidence  
3. **Third step**: Gradually increase complexity as you become more comfortable
4. **Final step**: Apply your knowledge to real-world scenarios

Each step builds upon the previous one. Would you like me to elaborate on any of these points?`;
  }
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('how')) {
    return `Let me break this down for you:

**Key Concept**: Understanding the core principles is essential for mastery.

**Why it matters**: This approach ensures you build a solid foundation rather than just memorizing steps.

**Practical application**: You can apply these principles across different scenarios and contexts.

The important thing to remember is that learning is a process, and it's okay to take your time with each concept.`;
  }
  
  // Return a random response for other messages
  return responses[Math.floor(Math.random() * responses.length)];
};

export const generateConversationTitle = (firstMessage: string): string => {
  const words = firstMessage.split(' ').slice(0, 6);
  return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
};