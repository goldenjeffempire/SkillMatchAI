import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Bot, X, Send, Image, Paperclip, CornerDownLeft, 
  Loader2, ChevronDown, Sparkles, User, Mic, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Interfaces for our chat
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 10);

// Markdown-like formatting for the assistant's responses
function formatText(text: string): JSX.Element {
  // Split text by newlines and handle code blocks
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, i) => {
        // Bold text between **
        const boldRegex = /\*\*(.*?)\*\*/g;
        const boldText = line.replace(boldRegex, '<strong>$1</strong>');
        
        // Italics text between *
        const italicRegex = /\*(.*?)\*/g;
        const formattedText = boldText.replace(italicRegex, '<em>$1</em>');
        
        // Links in [text](url) format
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        const linkedText = formattedText.replace(linkRegex, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>');
        
        // Replace HTML strings with actual JSX
        const html = { __html: linkedText };
        
        return (
          <div key={i} className={i > 0 ? "mt-2" : ""}>
            <span dangerouslySetInnerHTML={html} />
          </div>
        );
      })}
    </>
  );
}

// Message component to display individual chat messages
const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        "p-4 rounded-lg mb-4 flex",
        message.role === "user" ? 
          "bg-primary/10 ml-8" : 
          "bg-gray-800/60 mr-8 backdrop-blur-sm"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0",
        message.role === "user" ? "bg-accent" : "bg-primary",
      )}>
        {message.role === "user" ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-1">
          {message.role === "user" ? "You" : "AI Assistant"}
          <span className="ml-2 opacity-50 text-xs">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="text-gray-200 leading-relaxed">
          {formatText(message.content)}
        </div>
      </div>
    </motion.div>
  );
};

// Placeholder typing indicator
const TypingIndicator = () => {
  return (
    <div className="p-4 rounded-lg bg-gray-800/60 mb-4 flex items-center mr-8 backdrop-blur-sm">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex">
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

interface AIAssistantProps {
  initialOpen?: boolean;
  className?: string;
}

export function AIChatbot({ initialOpen = false, className = "" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "👋 Hello! I'm your AI assistant for Echoverse. I can help with content creation, answer questions about features, or guide you through the platform. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Keeping chat container scrolled to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Auto-focus the input field when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle textarea resizing
  const handleTextareaInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };
    
    setInput("");
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    
    try {
      // Mock AI response for now - in a real app, this would be an API call
      setTimeout(() => {
        const aiResponse: Message = {
          id: generateId(),
          role: "assistant",
          content: getAIResponse(input.trim()),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
      
      // In a real implementation, you'd call your API like this:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: input.trim() })
      // });
      //
      // if (!response.ok) throw new Error('Failed to get response');
      // const aiResponse = await response.json();
      // setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };

  // Temporary mock responses - would be replaced with actual AI API calls
  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello there! How can I assist you with Echoverse today?";
    }
    
    if (input.includes("features") || input.includes("what can you do")) {
      return "Echoverse offers several AI-powered features:\n\n" +
        "• **Content Generation** - Create blog posts, marketing copy, and more\n" +
        "• **Website Building** - Build websites from simple text prompts\n" +
        "• **E-commerce Tools** - Manage products, optimize listings\n" +
        "• **Educational Resources** - Access our vast book library with AI summaries\n\n" +
        "Which of these would you like to learn more about?";
    }
    
    if (input.includes("pricing") || input.includes("cost") || input.includes("subscription")) {
      return "Echoverse offers flexible pricing options:\n\n" +
        "• **Free Trial** - 14 days with full access to all features\n" +
        "• **Basic** - $29/mo with core AI features\n" +
        "• **Pro** - $79/mo with unlimited content generation\n" +
        "• **Enterprise** - Custom pricing for teams\n\n" +
        "You can view detailed pricing at [our pricing page](/subscription).";
    }
    
    if (input.includes("content") || input.includes("write") || input.includes("generate")) {
      return "Our EchoWriter tool can help you create high-quality content. You can generate:\n\n" +
        "• Blog posts optimized for SEO\n" +
        "• Marketing copy that converts\n" +
        "• Product descriptions\n" +
        "• Social media posts\n\n" +
        "Would you like a demonstration?";
    }
    
    return "I understand you're asking about \"" + userInput + "\". To better assist you, could you provide more specific details about what you're looking for in Echoverse?";
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle chat with Alt+/
      if (e.altKey && e.key === "/") {
        setIsOpen(prev => !prev);
      }
      
      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // The floating button to open the chat
  const ChatButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={() => setIsOpen(true)}
            className={cn(
              "rounded-full w-14 h-14 fixed bottom-6 right-6 shadow-lg z-50",
              "bg-primary hover:bg-primary/90 transition-all duration-300",
              className
            )}
            size="icon"
          >
            <Bot className="h-6 w-6 text-white" />
            <motion.div 
              className="absolute inset-0 bg-primary rounded-full"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay: 5
              }}
              style={{ zIndex: -1 }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>AI Assistant (Alt+/)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      <ChatButton />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-[5.5rem] right-6 w-[90vw] max-w-[450px] h-[600px]",
              "bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl z-50",
              "flex flex-col border border-white/10",
              className
            )}
          >
            {/* Chat header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mr-3">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold">AI Assistant</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-800"
                  onClick={() => setMessages([
                    {
                      id: generateId(),
                      role: "assistant",
                      content: "Chat history cleared. How can I help you today?",
                      timestamp: new Date()
                    }
                  ])}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" 
              ref={chatContainerRef}
            >
              <AnimatePresence>
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
            </div>
            
            {/* Input area */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="relative">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onInput={handleTextareaInput}
                    placeholder="Type your message..."
                    className="w-full pr-20 resize-none min-h-[60px] max-h-[150px] bg-gray-800/60 border-white/10 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-700">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach file</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-700">
                            <Mic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Voice input</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className={`h-8 w-8 rounded-full ${
                              input.trim() && !isLoading 
                                ? "bg-primary hover:bg-primary/90" 
                                : "bg-gray-700"
                            }`}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send (Enter)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                  <div>
                    Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to send,
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs ml-1">Shift+Enter</kbd> for new line
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    <span>AI Powered</span>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}