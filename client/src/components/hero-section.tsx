import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const stats = [
    { count: "15+", label: "AI Modules" },
    { count: "98%", label: "Customer Satisfaction" },
    { count: "24/7", label: "AI Support" },
    { count: "500+", label: "Integrations" }
  ];

  return (
    <section className="pt-32 pb-20 px-4 relative grid-bg">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/20 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-accent/20 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-6">
          <motion.div
            className="inline-block px-4 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary-foreground text-sm font-medium mb-4"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Introducing Echoverse
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            The <span className="cosmic-text">AI-Native</span> Platform <br/>For Modern Business
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-8"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Combine the power of AI with complete business tools - website builder, e-commerce, marketing, learning, and more in one modular platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Link href="/auth">
              <Button 
                className="px-6 py-3 font-medium bg-primary text-white rounded-lg shadow-glow hover:bg-primary/90 hover:scale-105 transition-all"
                size="lg"
              >
                Start Free Trial
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="px-6 py-3 font-medium border-primary/30 text-white rounded-lg hover:bg-primary/10"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </motion.div>
        </div>
        
        {/* Hero Image */}
        <motion.div
          className="relative mx-auto max-w-4xl glow-border rounded-2xl bg-gray-900/80 p-1 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=675"
              alt="Echoverse dashboard interface" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-40 rounded-xl"></div>
          </div>
        </motion.div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              custom={index + 4}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="text-3xl font-bold text-white mb-1">{stat.count}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
