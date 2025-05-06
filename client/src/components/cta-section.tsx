import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Clock, UserPlus, Zap, ArrowRight, Check } from "lucide-react";

// Testimonial card component
function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Scale and glow effect on hover
  const hoverVariants = {
    hover: { 
      scale: 1.02, 
      boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    }
  };
  
  // Shimmering effect
  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: { 
      x: "100%", 
      transition: { 
        repeat: Infinity, 
        repeatType: "loop" as const, 
        duration: 2, 
        repeatDelay: 6 
      } 
    }
  };
  
  return (
    <motion.div
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative overflow-hidden glass-effect"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover="hover"
      variants={hoverVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Shimmer overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        variants={shimmerVariants}
        initial="initial"
        animate={isHovered ? "animate" : "initial"}
      />
      
      {/* Company logo */}
      {testimonial.companyLogo && (
        <div className="mb-4">
          <img 
            src={testimonial.companyLogo} 
            alt={`${testimonial.company} logo`} 
            className="h-6 opacity-80"
          />
        </div>
      )}
      
      {/* Rating stars */}
      <div className="flex items-center space-x-1 mb-4">
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        
        {testimonial.verifiedCustomer && (
          <div className="ml-2 text-xs text-green-400 bg-green-400/10 rounded-full px-2 py-0.5 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      
      {/* Quote */}
      <blockquote className="text-gray-200 mb-6 relative">
        <span className="text-4xl absolute -top-3 -left-1 text-primary/30">"</span>
        <p className="relative z-10 text-lg leading-relaxed">{testimonial.text}</p>
        <span className="text-4xl absolute -bottom-6 -right-1 text-primary/30">"</span>
      </blockquote>
      
      {/* Author info */}
      <div className="flex items-center">
        {testimonial.avatar ? (
          <img 
            src={testimonial.avatar} 
            alt={testimonial.author} 
            className="w-12 h-12 rounded-full mr-3 border-2 border-primary/30"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center mr-3 shadow-lg`}>
            <span className="font-semibold text-white text-lg">{testimonial.initial}</span>
          </div>
        )}
        <div>
          <div className="font-medium text-white">{testimonial.author}</div>
          <div className="text-sm text-primary/80">{testimonial.role}</div>
          {testimonial.company && (
            <div className="text-xs text-gray-400">{testimonial.company}</div>
          )}
        </div>
      </div>
      
      {/* Industry tag */}
      {testimonial.industry && (
        <div className="absolute top-4 right-4 text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
          {testimonial.industry}
        </div>
      )}
    </motion.div>
  );
}

// Statistics counter
function StatCounter({ value, label, icon, delay }: { 
  value: string; 
  label: string; 
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="inline-flex items-center justify-center mb-4 w-12 h-12 rounded-lg cosmic-gradient">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

export function CTASection() {
  // Get current day for trial end date calculation
  const [currentDate] = useState(new Date());
  const trialEndDate = new Date(currentDate);
  trialEndDate.setDate(trialEndDate.getDate() + 14);
  
  // Format date as May 20, 2025
  const formattedDate = trialEndDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Primary CTA button animation
  const ctaButtonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
      transition: { 
        duration: 0.2,
        yoyo: Infinity,
        ease: "easeInOut" 
      }
    },
    tap: { scale: 0.98 }
  };
  
  // Testimonials with enhanced data
  const testimonials = [
    {
      text: "Echoverse transformed our e-commerce business. The AI tools helped us create better product descriptions that increased our conversion rate by 32%.",
      author: "Sarah Johnson",
      role: "Founder & CEO",
      company: "StyleNova",
      initial: "S",
      color: "bg-gradient-to-br from-primary to-violet-500",
      industry: "E-commerce",
      verifiedCustomer: true
    },
    {
      text: "As a developer, EchoDevBot saves me hours every day. It helps me write better code faster and automatically documents everything.",
      author: "Michael Chen",
      role: "Lead Developer",
      company: "TechFlow Solutions",
      initial: "M",
      color: "bg-gradient-to-br from-blue-600 to-cyan-500",
      industry: "Software Development",
      verifiedCustomer: true
    },
    {
      text: "The learning platform has been revolutionary for our school. AI-generated content keeps our students engaged while personalizing to each student's needs.",
      author: "Lisa Parker",
      role: "Education Director",
      company: "Future Academy",
      initial: "L",
      color: "bg-gradient-to-br from-accent to-pink-500",
      industry: "Education",
      verifiedCustomer: true
    }
  ];

  // Platform statistics
  const statistics = [
    { value: "10,000+", label: "Active Users", icon: <UserPlus className="h-5 w-5 text-white" />, delay: 0.1 },
    { value: "15+", label: "AI Tools", icon: <Sparkles className="h-5 w-5 text-white" />, delay: 0.2 },
    { value: "24/7", label: "Support", icon: <Clock className="h-5 w-5 text-white" />, delay: 0.3 },
    { value: "99.9%", label: "Uptime", icon: <Zap className="h-5 w-5 text-white" />, delay: 0.4 }
  ];

  // CTA section features
  const features = [
    "No credit card required to start",
    "Full access to all AI tools",
    "Unlimited content generation",
    "5 project spaces included",
    "Cancel anytime"
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/15 rounded-full filter blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-accent/10 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <motion.div 
        className="absolute inset-0 grid-bg opacity-30"
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
        {/* Main CTA content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left column: CTA text and buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <motion.div 
              className="inline-block px-4 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary-foreground text-sm font-medium mb-6 flex items-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Limited Time Offer: 30% Off All Plans</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to <span className="text-gradient-animated">Transform</span> Your Business?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Start with a 14-day free trial and explore all Echoverse features with no limitations. Unlock the power of AI for your business today.
            </motion.p>
            
            {/* Trial end date */}
            <motion.div 
              className="bg-gray-800/30 rounded-lg p-4 mb-8 flex items-center border border-white/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Clock className="h-5 w-5 text-primary mr-3" />
              <div>
                <div className="text-sm text-gray-400">Free trial ends on</div>
                <div className="font-medium">{formattedDate}</div>
              </div>
            </motion.div>
            
            {/* Feature list */}
            <motion.ul 
              className="space-y-3 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                >
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/auth">
                <motion.div
                  variants={ctaButtonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    className="w-full sm:w-auto px-8 py-6 text-lg font-medium bg-primary text-white rounded-xl shadow-glow transition-all relative overflow-hidden group"
                    size="lg"
                  >
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/subscription">
                <Button 
                  className="w-full sm:w-auto px-8 py-6 text-lg font-medium border-2 border-primary/30 bg-transparent hover:bg-primary/10 text-white rounded-xl transition-all"
                  size="lg"
                  variant="outline"
                >
                  View Pricing Plans
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right column: Statistics */}
          <motion.div
            className="lg:p-8 rounded-2xl relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-lg" />
            
            {/* Stats grid */}
            <div className="relative z-10 grid grid-cols-2 gap-8 p-6 rounded-xl bg-gray-800/20 backdrop-blur-sm border border-white/5">
              {statistics.map((stat, index) => (
                <StatCounter 
                  key={index} 
                  value={stat.value} 
                  label={stat.label} 
                  icon={stat.icon}
                  delay={stat.delay}
                />
              ))}
              
              {/* Growth graph preview */}
              <motion.div 
                className="col-span-2 mt-4 bg-gray-900/50 rounded-lg p-4 border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-sm">Average Customer Growth</h4>
                  <div className="text-green-400 text-sm font-medium flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                    +43%
                  </div>
                </div>
                
                {/* Animated growth chart bars */}
                <div className="flex items-end h-20 gap-1">
                  {[30, 45, 25, 60, 35, 50, 70, 55, 65, 80, 75, 90].map((height, i) => (
                    <motion.div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.7 + (i * 0.05) }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial heading */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">What Our Customers Say</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of businesses already transforming their operations with Echoverse.
          </p>
        </motion.div>
        
        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
        
        {/* Final CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/auth">
            <Button 
              className="px-8 py-5 text-lg font-medium bg-primary/90 hover:bg-primary text-white rounded-xl shadow-glow transform transition-all hover:scale-105"
              size="lg"
            >
              Start Your Free Trial Today
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">No credit card required to get started</p>
        </motion.div>
      </div>
    </section>
  );
}
