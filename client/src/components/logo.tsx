import { motion } from "framer-motion";

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="h-10 w-10 rounded-lg cosmic-gradient flex items-center justify-center shadow-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-white font-bold text-xl">E</span>
      </motion.div>
      
      {variant === "full" && (
        <motion.span 
          className="text-white font-bold text-xl"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Echoverse
        </motion.span>
      )}
    </div>
  );
}

export function AnimatedLogo() {
  return (
    <div className="relative w-64 h-64 mx-auto cosmic-gradient rounded-full flex items-center justify-center shadow-glow animate-pulse-slow">
      <div className="absolute inset-2 rounded-full border-4 border-white/20"></div>
      <div className="text-5xl font-bold text-white">E</div>
      
      {/* Orbiting elements */}
      <motion.div 
        className="absolute w-12 h-12 bg-accent rounded-full -top-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center shadow-glow-accent"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute w-12 h-12 bg-primary rounded-full -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center shadow-glow"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute w-12 h-12 bg-blue-600 rounded-full left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center shadow-glow"
        animate={{ 
          x: [-6, 6, -6],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 100-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute w-12 h-12 bg-indigo-400 rounded-full right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 flex items-center justify-center shadow-glow"
        animate={{ 
          x: [6, -6, 6],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </motion.div>
    </div>
  );
}
