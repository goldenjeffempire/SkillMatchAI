import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X, Maximize2, Minimize2, Bot, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function AIChatbot() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome-message",
    role: "assistant",
    content: "Hello! 👋 I'm Echo, your AI assistant for the Echoverse platform. How can I help you today?",
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus on input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Format history for the API
      const history = messages
        .filter(msg => msg.role !== "system")
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Send request to API
      const response = await apiRequest("POST", "/api/ai/chat", {
        message: userMessage.content,
        history
      });
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: "system",
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Animation variants
  const chatButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 17 } },
    tap: { scale: 0.9 },
    hover: { scale: 1.1 }
  };

  const chatContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Calculate minimized height
  const minimizedHeight = "3.5rem";
  const expandedHeight = "min(30rem, calc(100vh - 8rem))";
  const expandedWidth = "min(24rem, calc(100vw - 2rem))";

  // Chat toggler button
  const ChatToggler = () => (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial="initial"
      animate="animate"
      variants={chatButtonVariants}
    >
      <motion.div 
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(true)}
        whileHover="hover"
        whileTap="tap"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.div>
    </motion.div>
  );

  // Format timestamp to user-friendly time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to render messages with proper styles
  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const isSystem = message.role === "system";
    
    return (
      <div
        key={message.id}
        className={cn(
          "mb-4 relative",
          isUser ? "text-right" : "text-left"
        )}
      >
        <div className="flex items-start gap-2 max-w-[85%] mx-0 relative">
          {!isUser && (
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarImage src="/assets/ai-assistant.svg" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div
            className={cn(
              "p-3 rounded-lg inline-block",
              isUser ? "bg-primary text-primary-foreground ml-auto" : 
              isSystem ? "bg-muted text-muted-foreground" : 
              "bg-card border"
            )}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-xs opacity-70 block mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
          
          {isUser && (
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return <ChatToggler />;
  }

  return (
    <motion.div 
      className="fixed bottom-4 right-4 z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={chatContainerVariants}
    >
      <Card 
        className={cn(
          "w-full overflow-hidden transition-all duration-300",
          isMinimized ? "h-[3.5rem]" : "h-[30rem]"
        )}
        style={{ 
          width: isMinimized ? "20rem" : expandedWidth,
          height: isMinimized ? minimizedHeight : expandedHeight
        }}
      >
        {/* Chat Header */}
        <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Echo AI Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <CardContent className="p-0 overflow-auto h-full">
              <ScrollArea className="h-[calc(30rem-8rem)] p-4">
                <div className="flex flex-col">
                  {messages.map(renderMessage)}
                  <div ref={messagesEndRef} />
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <motion.div 
                        className="flex gap-1"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5,
                          ease: "easeInOut",
                          times: [0, 0.2, 0.5, 0.8, 1],
                          repeatDelay: 0.25
                        }}
                      >
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30" 
                          style={{ animationDelay: "0.2s" }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/30"
                          style={{ animationDelay: "0.4s" }} />
                      </motion.div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            {/* Chat Input */}
            <CardFooter className="p-3 pt-2 border-t">
              <div className="relative w-full flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  placeholder="Type your message..."
                  className="min-h-12 w-full resize-none py-3 pr-12"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="absolute right-1 bottom-1 h-10 w-10"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </>
        )}
        
        {isMinimized && (
          <div className="flex items-center px-3 h-full">
            <ChevronDown className="h-4 w-4 text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              {messages.length > 1 
                ? "Click to continue your conversation" 
                : "Ask me anything about Echoverse"}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}