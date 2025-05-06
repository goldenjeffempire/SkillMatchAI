import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { AnimatedLogo } from "@/components/logo";
import { 
  FileText, Layout, DollarSign, 
  MessageCircle, BookOpen, Code,
  Brain, Zap, Sparkles, Bot, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interactive AI tool card component
function AIToolCard({ tool, index, isActive, onClick }: { 
  tool: any; 
  index: number;
  isActive: boolean;
  onClick: () => void; 
}) {
  // Mouse hover animation states
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants for the cards
  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    }
  };
  
  // Animated background shine effect
  const shineVariants = {
    hidden: { opacity: 0, x: "-100%" },
    hover: { 
      opacity: 0.2, 
      x: "100%",
      transition: { duration: 1, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }
    }
  };

  return (
    <motion.div
      key={tool.title}
      className={`rounded-xl glass-effect p-6 border transition-all duration-300 ${
        isActive 
          ? "border-primary shadow-glow" 
          : "border-white/5 hover:border-white/20"
      }`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Shine effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl overflow-hidden pointer-events-none"
        variants={shineVariants}
        initial="hidden"
        animate={isHovered ? "hover" : "hidden"}
      />
      
      <div className="flex items-start gap-4 relative z-10">
        <motion.div 
          className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}
          whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {tool.icon}
        </motion.div>
        
        <div>
          <motion.h4 
            className={`text-xl font-semibold mb-2 ${isActive ? "text-primary" : "text-white"}`}
            animate={{ color: isActive ? "hsl(267, 75%, 60%)" : "white" }}
          >
            {tool.title}
          </motion.h4>
          
          <p className="text-gray-300 text-sm mb-3">
            {tool.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag: string, i: number) => (
              <motion.span 
                key={i}
                className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div 
          className="absolute bottom-3 right-3 text-primary text-sm font-medium flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="h-2 w-2 bg-primary rounded-full animate-pulse inline-block"></span>
          <span>Active</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// Animated showcase for selected AI tool
function AIToolShowcase({ tool }: { tool: any }) {
  const showcaseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Parallax effect values
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [2, -2]);
  
  return (
    <motion.div 
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-white/5 relative overflow-hidden"
      variants={showcaseVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ y, rotate }}
      drag="y"
      dragConstraints={{ top: -5, bottom: 5 }}
      dragElastic={0.1}
    >
      {/* Background glow effects */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full filter blur-[80px]"/>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full filter blur-[50px]"/>
      
      {/* Tool content */}
      <motion.div 
        className="relative z-10"
        variants={itemVariants}
      >
        <div className="flex items-center mb-6 gap-3">
          <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center shadow-lg`}>
            {tool.icon}
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white">{tool.title}</h4>
            <p className="text-primary-foreground/70">AI-powered assistant</p>
          </div>
        </div>
        
        <motion.p 
          className="text-gray-300 mb-6"
          variants={itemVariants}
        >
          {tool.description}
        </motion.p>
        
        <motion.div 
          className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-white/5"
          variants={itemVariants}
        >
          <h5 className="font-medium mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4"/> Key Capabilities
          </h5>
          <ul className="space-y-2">
            {tool.capabilities.map((capability: string, i: number) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-2 text-sm text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0"/>
                <span>{capability}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-2 mb-6"
          variants={itemVariants}
        >
          <div className="text-sm text-gray-400 mr-2">Perfect for:</div>
          {(tool.audience?.split(', ') || []).map((audience: string, i: number) => (
            <span 
              key={i}
              className="text-sm bg-gray-700/30 text-white px-3 py-1 rounded-full"
            >
              {audience}
            </span>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex gap-3"
          variants={itemVariants}
        >
          <Button className="bg-primary shadow-glow hover:bg-primary/90">
            Try {tool.title}
          </Button>
          <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
            View Examples
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function AIToolsSection() {
  const [selectedTool, setSelectedTool] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Auto rotate tools
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setSelectedTool(prev => (prev + 1) % aiTools.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedTool]);
  
  // Mouse hover state
  const [isHovered, setIsHovered] = useState(false);
  
  const aiTools = [
    {
      title: "EchoWriter",
      description: "Advanced content generation AI that creates engaging blogs, product descriptions, marketing copy, and more.",
      icon: <FileText className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-accent to-purple-600",
      audience: "Content creators, marketers, businesses",
      capabilities: [
        "SEO-optimized blog posts and articles",
        "Product descriptions that convert",
        "Creative writing and storytelling",
        "Multi-language content translation",
        "Brand-voice consistent copy"
      ],
      tags: ["Content", "Marketing", "SEO"]
    },
    {
      title: "EchoBuilder",
      description: "AI that transforms your ideas into complete websites or e-commerce stores from simple text prompts.",
      icon: <Layout className="h-6 w-6 text-white" />,
      color: "cosmic-gradient",
      audience: "Entrepreneurs, small businesses, startups",
      capabilities: [
        "Complete website generation from prompts",
        "Responsive designs that work on all devices",
        "E-commerce store setup with products",
        "SEO-friendly page structure",
        "Custom branding incorporation"
      ],
      tags: ["Web Design", "E-commerce", "UI/UX"]
    },
    {
      title: "EchoSeller",
      description: "Sales acceleration AI that creates high-converting sales pages, email sequences, and persuasive pitches.",
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-600 to-cyan-500",
      audience: "Sales teams, entrepreneurs, marketing agencies",
      capabilities: [
        "High-converting sales page copy",
        "Email follow-up sequences",
        "Sales pitch scripts and presentations",
        "Objection handling suggestions",
        "Pricing strategy recommendations"
      ],
      tags: ["Sales", "Conversion", "Revenue"]
    },
    {
      title: "EchoMarketer",
      description: "Multi-channel marketing AI that creates campaigns, analyzes performance, and optimizes for conversions.",
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-indigo-500 to-blue-400",
      audience: "Marketing teams, growth hackers, digital agencies",
      capabilities: [
        "Multi-channel campaign planning",
        "Email marketing sequences",
        "Social media content calendars",
        "A/B testing suggestions",
        "Data-driven optimization insights"
      ],
      tags: ["Marketing", "Growth", "Analytics"]
    },
    {
      title: "EchoTeacher",
      description: "Educational AI that generates personalized courses, assessments, and interactive learning materials.",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-primary to-violet-400",
      audience: "Educators, parents, students, course creators",
      capabilities: [
        "Custom curriculum development",
        "Interactive quiz and assessment creation",
        "Personalized learning paths",
        "Knowledge gap identification",
        "Educational content simplification"
      ],
      tags: ["Education", "Learning", "Courses"]
    },
    {
      title: "EchoDevBot",
      description: "Developer assistant AI that writes code, generates documentation, and helps solve technical challenges.",
      icon: <Code className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-accent/80 to-pink-500",
      audience: "Developers, tech teams, product managers",
      capabilities: [
        "Code generation in multiple languages",
        "Bug identification and fixing",
        "Technical documentation writing",
        "API integration assistance",
        "Code refactoring and optimization"
      ],
      tags: ["Development", "Coding", "Technical"]
    },
    {
      title: "EchoBrainiac",
      description: "Advanced research and analysis AI that digs deep into topics and provides structured insights.",
      icon: <Brain className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-400",
      audience: "Researchers, analysts, strategists, students",
      capabilities: [
        "In-depth research reports",
        "Market analysis and trend identification",
        "Competitive intelligence gathering",
        "Academic research assistance",
        "Data synthesis and summarization"
      ],
      tags: ["Research", "Analysis", "Intelligence"]
    },
    {
      title: "EchoAssistant",
      description: "Personal AI assistant that handles tasks, manages schedules, and provides real-time information.",
      icon: <Bot className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-400",
      audience: "Executives, professionals, remote teams",
      capabilities: [
        "Task and project management",
        "Meeting scheduling and reminders",
        "Email drafting and management",
        "Real-time information retrieval",
        "Process automation and workflows"
      ],
      tags: ["Productivity", "Assistance", "Organization"]
    }
  ];

  return (
    <section id="ai-tools" className="py-24 px-4 relative" ref={sectionRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-[20%] w-[400px] h-[400px] bg-primary/15 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.15, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-[20%] w-[500px] h-[500px] bg-accent/10 rounded-full filter blur-[150px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            className="text-accent font-medium mb-3 flex items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="w-5 h-5 mr-2" />
            <span>AI OMNILAYER</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-gradient-animated"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Powerful AI Agents For Every Need
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Specialized AI agents that power every aspect of your business, from content creation to sales and development.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: AI Tools List (4 columns on large screens) */}
          <div className="lg:col-span-5 space-y-4">
            <motion.h3 
              className="text-2xl font-bold mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Meet Your AI Team
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {aiTools.map((tool, index) => (
                <AIToolCard
                  key={tool.title}
                  tool={tool}
                  index={index}
                  isActive={selectedTool === index}
                  onClick={() => setSelectedTool(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Right Column: Tool Showcase (8 columns on large screens) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 h-fit">
            <AnimatePresence mode="wait">
              <AIToolShowcase 
                key={selectedTool} 
                tool={aiTools[selectedTool]} 
              />
            </AnimatePresence>
            
            {/* AI Technology Section */}
            <motion.div 
              className="mt-8 bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Advanced AI Technology
              </h4>
              
              <p className="text-gray-300 mb-4">
                Our AI tools are powered by state-of-the-art large language models and specialized algorithms, fine-tuned for specific business needs.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Natural Language Processing", "Computer Vision", "Deep Learning", "Multi-modal AI"].map((tech, i) => (
                  <motion.div 
                    key={i}
                    className="bg-gray-700/30 rounded-lg p-3 text-center text-sm border border-white/5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="default" 
            className="px-8 py-6 text-lg font-medium bg-primary shadow-glow rounded-xl hover:bg-primary/90 hover:scale-105 transition-all"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Explore All AI Tools
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
