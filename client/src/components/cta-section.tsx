import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const testimonials = [
    {
      text: "Echoverse completely transformed our e-commerce business. The AI tools helped us create better product descriptions and marketing emails that actually convert.",
      author: "Sarah Johnson",
      role: "E-commerce Founder",
      initial: "S",
      color: "bg-primary"
    },
    {
      text: "As a developer, EchoDevBot has been a game-changer. It helps me write better code faster and the marketplace lets me share my creations with others.",
      author: "Michael Chen",
      role: "Full-Stack Developer",
      initial: "M",
      color: "bg-blue-600"
    },
    {
      text: "I use the learning portal for my students, and they absolutely love it. The AI generates personalized content that keeps them engaged and learning.",
      author: "Lisa Parker",
      role: "Education Consultant",
      initial: "L",
      color: "bg-accent"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[30%] w-96 h-96 bg-primary/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-10 right-[20%] w-72 h-72 bg-accent/20 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with a 14-day free trial and explore all Echoverse features with no limitations.
          </p>
          <Link href="/auth">
            <Button 
              className="inline-flex items-center px-8 py-4 font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-glow transition-all transform hover:scale-105"
              size="lg"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">No credit card required</p>
        </motion.div>
        
        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-primary/10 glow-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-1 mb-4 text-yellow-400">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-300 mb-6">
                "{testimonial.text}"
              </blockquote>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center mr-3`}>
                  <span className="font-semibold text-white">{testimonial.initial}</span>
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
