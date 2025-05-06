import { motion } from "framer-motion";
import { AnimatedLogo } from "@/components/logo";
import { 
  FileText, Layout, DollarSign, 
  MessageCircle, BookOpen, Code 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIToolsSection() {
  const aiTools = [
    {
      title: "EchoWriter",
      description: "Generates blogs, product descriptions, bios, and any content you need to engage your audience.",
      icon: <FileText className="h-5 w-5 text-white" />,
      color: "bg-accent",
      audience: "Content creators, marketers, businesses"
    },
    {
      title: "EchoBuilder",
      description: "Builds complete websites or stores from simple text prompts with your brand guidelines.",
      icon: <Layout className="h-5 w-5 text-white" />,
      color: "cosmic-gradient",
      audience: "Entrepreneurs, small businesses"
    },
    {
      title: "EchoSeller",
      description: "Creates high-converting sales pages, pitch scripts, and follow-up sequences that close deals.",
      icon: <DollarSign className="h-5 w-5 text-white" />,
      color: "bg-blue-600",
      audience: "Sales teams, entrepreneurs"
    },
    {
      title: "EchoMarketer",
      description: "Crafts email campaigns, SEO content, and CRM sequences that convert prospects to customers.",
      icon: <MessageCircle className="h-5 w-5 text-white" />,
      color: "bg-indigo-400",
      audience: "Marketing teams, growth hackers"
    },
    {
      title: "EchoTeacher",
      description: "Generates quizzes, lessons, and personalized learning paths for students of all ages.",
      icon: <BookOpen className="h-5 w-5 text-white" />,
      color: "bg-primary",
      audience: "Educators, parents, students"
    },
    {
      title: "EchoDevBot",
      description: "Writes code, generates plugins, and helps developers build faster with AI assistance.",
      icon: <Code className="h-5 w-5 text-white" />,
      color: "bg-accent/80",
      audience: "Developers, tech teams"
    }
  ];

  return (
    <section id="ai-tools" className="py-20 px-4 relative">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[20%] w-64 h-64 bg-primary/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-[20%] w-64 h-64 bg-blue-600/10 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16">
          <div className="text-accent font-medium mb-3">AI OMNILAYER</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful AI Agents For Every Need</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Specialized AI agents that power every aspect of your business, from content creation to sales and development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div>
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Meet Your AI Team</h3>
              <p className="text-gray-400 mb-6">
                Our AI agents are designed to work together seamlessly, each specializing in different aspects of your business.
              </p>
              
              {/* Animated Echo logo */}
              <AnimatedLogo />
            </div>
          </div>
          
          {/* Right Column: AI Tools */}
          <div className="space-y-5">
            {aiTools.map((tool, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-primary/10 glow-border card-hover"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                    {tool.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{tool.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {tool.description}
                    </p>
                    <div className="text-xs text-gray-500">Perfect for: {tool.audience}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 border-primary/30 rounded-lg text-white hover:bg-primary/10">
            View All AI Tools
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
