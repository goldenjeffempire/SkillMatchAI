import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, X, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialSystemMessage = `I'm EchoBot, your AI assistant in Echoverse. I can help you with content creation, answer questions, or assist with using the platform.`;

export function AiChatbot({ 
  initiallyOpen = false,
  useFullScreen = false,
  className = "" 
}: { 
  initiallyOpen?: boolean;
  useFullScreen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "assistant",
      content: initialSystemMessage,
      timestamp: new Date(),
    },
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        model,
        temperature,
        history: messages.map(({ role, content }) => ({ role, content })),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to get response: ${error.message}`,
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message to state
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setInput("");
    
    // Send to AI
    chatMutation.mutate(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "system-1",
        role: "assistant",
        content: initialSystemMessage,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {!isOpen && !useFullScreen && (
        <motion.button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 bg-primary text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Bot size={24} />
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="ml-2 whitespace-nowrap overflow-hidden"
            >
              Chat with AI
            </motion.span>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen || useFullScreen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              useFullScreen
                ? "relative w-full h-full rounded-lg overflow-hidden flex flex-col bg-background border"
                : "fixed bottom-5 right-5 w-96 h-[32rem] rounded-lg overflow-hidden flex flex-col shadow-xl z-50 bg-background border",
              className
            )}
          >
            {/* Chat Header */}
            <div className="p-3 border-b flex items-center justify-between bg-secondary/20">
              <div className="flex items-center">
                <Bot className="text-primary mr-2" size={20} />
                <h3 className="font-medium">EchoBot AI Assistant</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-8 w-8"
                >
                  <Settings size={18} />
                </Button>
                {!useFullScreen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b overflow-hidden"
                >
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="text-sm font-medium">AI Model</label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="mt-1 block w-full p-2 bg-background border rounded-md text-sm"
                      >
                        <option value="gpt-4o">GPT-4o (Recommended)</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Temperature: {temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Precise</span>
                        <span>Balanced</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={clearChat}>
                        Clear Chat
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "assistant" ? (
                        <Bot size={16} className="mr-1" />
                      ) : (
                        <User size={16} className="mr-1" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.role === "user" ? user?.username || "You" : "EchoBot"}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="p-3 border-t">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="pr-12"
                  disabled={chatMutation.isPending}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!input.trim() || chatMutation.isPending}
                >
                  <Send size={16} />
                </Button>
              </div>
              <div className="mt-2 text-center text-xs text-muted-foreground">
                {!user ? (
                  <span>Sign in for unlimited access</span>
                ) : (
                  <span>AI assistance powered by OpenAI</span>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default AiChatbot;