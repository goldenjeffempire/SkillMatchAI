import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Brain, BarChart2 } from "lucide-react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [cursorHovered, setCursorHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Automatic slider for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion animations
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

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 0 25px rgba(123, 31, 162, 0.5)" 
    },
    tap: { 
      scale: 0.98 
    }
  };

  // Moving gradients
  const xMotion = useMotionValue(0);
  const yMotion = useMotionValue(0);
  
  useEffect(() => {
    xMotion.set(mousePosition.x / 80);
    yMotion.set(mousePosition.y / 80);
  }, [mousePosition]);
  
  const gradient1X = useTransform(xMotion, (value) => value * -1);
  const gradient1Y = useTransform(yMotion, (value) => value * -1);
  const gradient2X = useTransform(xMotion, (value) => value * 1.2);
  const gradient2Y = useTransform(yMotion, (value) => value * 1.2);

  // Stats with icons
  const stats = [
    { count: "15+", label: "AI Modules", icon: <Brain className="h-6 w-6 text-primary mb-2" /> },
    { count: "98%", label: "Customer Satisfaction", icon: <BarChart2 className="h-6 w-6 text-primary mb-2" /> },
    { count: "24/7", label: "AI Support", icon: <Zap className="h-6 w-6 text-primary mb-2" /> },
    { count: "500+", label: "Integrations", icon: <Sparkles className="h-6 w-6 text-primary mb-2" /> }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Echoverse transformed our business with its AI tools. In just weeks, we saw a 40% increase in efficiency.",
      author: "Sarah Johnson",
      role: "CEO, TechNova",
    },
    {
      quote: "The all-in-one platform helped us replace 5 different tools. Our team is more productive than ever.",
      author: "Michael Chen",
      role: "Marketing Director, GrowthX",
    },
    {
      quote: "We built our entire online presence with Echoverse. From website to e-commerce to marketing - it does it all.",
      author: "Jessica Williams",
      role: "Founder, Artisan Collective",
    },
  ];

  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden" ref={containerRef}>
      {/* Animated background gradients */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-[150px]"
          style={{ 
            x: gradient1X, 
            y: gradient1Y,
          }}
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-[10%] w-[600px] h-[600px] bg-accent/20 rounded-full filter blur-[180px]"
          style={{ 
            x: gradient2X, 
            y: gradient2Y,
          }}
          animate={{
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      </div>
      
      {/* Grid background with subtle animation */}
      <motion.div 
        className="absolute inset-0 grid-bg opacity-40"
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <motion.div
            className="inline-block px-4 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary-foreground text-sm font-medium mb-4"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="mr-2">✨</span>
            Introducing Echoverse
            <span className="ml-2">✨</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl font-bold mb-6 leading-tight"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            The <span className="cosmic-text relative inline-block">
              AI-Native
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{
                  width: ["0%", "100%", "100%", "0%"],
                  left: ["0%", "0%", "0%", "100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
            </span> Platform <br/>
            <motion.span
              animate={{
                color: ["#ffffff", "#c4a7ff", "#ffffff"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              For Modern Business
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Combine the power of AI with complete business tools - website builder, 
            e-commerce, marketing, learning, and more in one modular platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Link href="/auth">
              <motion.div 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  className="px-8 py-6 text-lg font-medium bg-primary text-white rounded-xl shadow-glow transition-all relative overflow-hidden group"
                  size="lg"
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </span>
                </Button>
              </motion.div>
            </Link>
            
            <motion.div 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg font-medium border-primary/30 text-white rounded-xl hover:bg-primary/10 relative overflow-hidden"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">See How It Works</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Hero Dashboard Image with interactive elements */}
        <motion.div
          className="relative mx-auto max-w-5xl p-2 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-lg opacity-70" />
          
          {/* Glowing border */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[#0c0c14] rounded-2xl" />
            
            {/* Animated glow spots */}
            <motion.div 
              className="absolute w-64 h-64 bg-primary/30 rounded-full filter blur-[80px]"
              style={{ 
                x: mousePosition.x - 100, 
                y: mousePosition.y - 100,
                opacity: cursorHovered ? 0.4 : 0.1,
              }}
              transition={{ type: "spring", damping: 20 }}
            />
            
            <div className="relative z-10 overflow-hidden rounded-xl">
              <div className="flex justify-center items-center bg-gray-900/80 rounded-xl p-2">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=675"
                  alt="Echoverse dashboard interface" 
                  className="w-full h-auto object-cover rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Interactive dashboard elements */}
              <motion.div 
                className="absolute top-4 right-6 bg-primary/90 text-white px-3 py-1 rounded-lg text-sm flex items-center shadow-glow"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 mr-1" /> AI Powered
              </motion.div>
              
              <motion.div 
                className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm border border-white/10"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Built for the future of business
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Testimonial Slider */}
        <motion.div 
          className="mt-16 mb-12 max-w-4xl mx-auto rounded-xl p-6 bg-gray-900/30 backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="relative h-32">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <p className="text-gray-200 italic text-lg mb-4 text-center">"{testimonials[activeIndex].quote}"</p>
                <div className="text-center">
                  <p className="font-semibold text-white">{testimonials[activeIndex].author}</p>
                  <p className="text-primary/80 text-sm">{testimonials[activeIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dots for slider */}
          <div className="flex justify-center space-x-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-primary w-6" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Stats with interactive hover */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              custom={index + 4}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              whileHover={{ 
                y: -5, 
                scale: 1.05,
                transition: { duration: 0.2 } 
              }}
              className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-white/5"
            >
              <div className="flex justify-center">{stat.icon}</div>
              <div className="text-4xl font-bold text-white mb-1">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1 + 0.5,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                >
                  {stat.count}
                </motion.span>
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
