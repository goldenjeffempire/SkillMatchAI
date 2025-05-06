import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I'm Echo, your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: getAIResponse(inputValue, user?.username),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }, 1000);
  };

  // Simple response generation - in a real app, this would call the OpenAI API
  const getAIResponse = (message: string, username?: string): string => {
    const greeting = username ? `Hi ${username}! ` : "";
    
    if (message.toLowerCase().includes("help")) {
      return `${greeting}I can help you with various tasks like building websites, writing content, creating marketing materials, or learning new skills. What would you like to work on today?`;
    } 
    else if (message.toLowerCase().includes("website") || message.toLowerCase().includes("build")) {
      return `${greeting}I'd be happy to help you build a website! With EchoBuilder, you can create a professional website by describing what you want, and I'll generate it for you. Would you like to start with a business site, portfolio, or online store?`;
    }
    else if (message.toLowerCase().includes("ai") || message.toLowerCase().includes("tool")) {
      return `${greeting}Echoverse offers several AI tools including EchoWriter for content creation, EchoBuilder for websites, EchoSeller for sales copy, EchoMarketer for marketing, and EchoTeacher for learning materials. Which one interests you most?`;
    }
    else if (message.toLowerCase().includes("book") || message.toLowerCase().includes("read")) {
      return `${greeting}Our Books & Growth Library has thousands of titles on productivity, business, personal development, and more. I can recommend books based on your interests or help you find specific topics. What topics interest you?`;
    }
    else if (message.toLowerCase().includes("login") || message.toLowerCase().includes("account")) {
      return `${greeting}You can create an account or login by clicking the "Get Started" button in the top right corner. This will give you full access to all Echoverse features and save your progress.`;
    }
    else {
      return `${greeting}Thanks for your message! I'm here to help with anything related to Echoverse's tools for website building, content creation, e-commerce, marketing, or learning. Is there something specific you'd like to know more about?`;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        className="w-14 h-14 rounded-full cosmic-gradient flex items-center justify-center shadow-glow"
        onClick={toggleChatbot}
        aria-label="Toggle chatbot"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 rounded-xl shadow-lg border border-primary/20 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <div className="font-medium text-white">Echo Assistant</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeChatbot}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="h-80 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: "smooth" }}>
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === "assistant" && (
                    <div className="w-8 h-8 rounded-full cosmic-gradient flex-shrink-0 flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-sm">E</span>
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "assistant" 
                      ? "bg-gray-800 rounded-tl-none" 
                      : "bg-primary text-white rounded-tr-none"
                  }`}>
                    <p className="text-sm">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full cosmic-gradient flex-shrink-0 flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg rounded-tl-none p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-gray-800 border-gray-700 pr-10 py-2 text-white text-sm focus:outline-none focus:border-primary rounded-lg"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary h-8 w-8 p-0"
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
