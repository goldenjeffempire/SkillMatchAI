import { motion } from "framer-motion";
import { 
  Monitor, ShoppingBag, BookOpen, 
  MessageSquare, Calendar, MessageCircle 
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Website Builder",
      description: "Create stunning websites with AI-powered drag-and-drop tools or let AI build it for you.",
      icon: <Monitor className="h-6 w-6 text-white" />,
    },
    {
      title: "E-Commerce",
      description: "Sell products, manage inventory, and process payments with AI to optimize your store.",
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
    },
    {
      title: "Books & Learning",
      description: "Access a vast library of growth content for all ages with AI-generated recommendations.",
      icon: <BookOpen className="h-6 w-6 text-white" />,
    },
    {
      title: "Marketing & CRM",
      description: "Manage contacts, create campaigns, and automate your marketing with AI assistance.",
      icon: <MessageCircle className="h-6 w-6 text-white" />,
    },
    {
      title: "Social & Community",
      description: "Build your community with public feed, likes, comments, and AI content moderation.",
      icon: <MessageSquare className="h-6 w-6 text-white" />,
    },
    {
      title: "Jobs & Calendar",
      description: "Post jobs, schedule appointments, and get AI assistance for hiring and scheduling.",
      icon: <Calendar className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-900 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="text-accent font-medium mb-3">MODULAR PLATFORM</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Every Feature Your Business Needs</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            One platform with everything you need. Start with what you need now and expand as you grow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-primary/10 glow-border card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 mb-4 rounded-lg cosmic-gradient flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <a href="#" className="text-primary-foreground hover:text-white flex items-center text-sm font-medium">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
