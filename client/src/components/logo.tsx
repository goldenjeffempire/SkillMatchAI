import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  variant?: "default" | "icon";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  // Icon-only variant
  if (variant === "icon") {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-primary", className)}
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4c1.61 0 3.16.312 4.578.88L13.12 14.422a9.935 9.935 0 00-.88-4.578A9.977 9.977 0 0116 6zm-4.834 2.46a9.967 9.967 0 00-2.21 3.586 9.912 9.912 0 00-.637 3.493c0 3.268 1.63 6.152 4.117 7.896L8.56 19.56l2.606-11.1zm4.834 15.54c-2.736 0-5.217-1.086-7.035-2.852l6.852-3.178L22.46 8.166a9.924 9.924 0 012.88 5.097c.106.581.16 1.178.16 1.795 0 5.522-4.477 10-10 10z"
          fill="currentColor"
        />
      </svg>
    );
  }

  // Full logo (default)
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary mr-2"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4c1.61 0 3.16.312 4.578.88L13.12 14.422a9.935 9.935 0 00-.88-4.578A9.977 9.977 0 0116 6zm-4.834 2.46a9.967 9.967 0 00-2.21 3.586 9.912 9.912 0 00-.637 3.493c0 3.268 1.63 6.152 4.117 7.896L8.56 19.56l2.606-11.1zm4.834 15.54c-2.736 0-5.217-1.086-7.035-2.852l6.852-3.178L22.46 8.166a9.924 9.924 0 012.88 5.097c.106.581.16 1.178.16 1.795 0 5.522-4.477 10-10 10z"
          fill="currentColor"
        />
      </svg>
      <span className="text-xl font-semibold">Echoverse</span>
    </div>
  );
}

// Animated logo version with motion effects
export function AnimatedLogo({ className }: { className?: string }) {
  // Logo circle animation variants
  const circleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Logo text animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Rays animation (the paths inside the logo)
  const raysVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { 
      opacity: 1,
      pathLength: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={circleVariants}
        className="relative"
      >
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary mr-3"
        >
          {/* Base circle */}
          <motion.path
            d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
            fill="currentColor"
            opacity="0.2"
          />
          
          {/* Animated paths */}
          <motion.path
            d="M16 6c1.61 0 3.16.312 4.578.88L13.12 14.422a9.935 9.935 0 00-.88-4.578A9.977 9.977 0 0116 6z"
            fill="currentColor"
            variants={raysVariants}
          />
          <motion.path
            d="M11.166 8.46a9.967 9.967 0 00-2.21 3.586 9.912 9.912 0 00-.637 3.493c0 3.268 1.63 6.152 4.117 7.896L8.56 19.56l2.606-11.1z"
            fill="currentColor"
            variants={raysVariants}
          />
          <motion.path
            d="M16 24c-2.736 0-5.217-1.086-7.035-2.852l6.852-3.178L22.46 8.166a9.924 9.924 0 012.88 5.097c.106.581.16 1.178.16 1.795 0 5.522-4.477 10-10 10z"
            fill="currentColor"
            variants={raysVariants}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="text-2xl font-bold tracking-tight">Echoverse</span>
      </motion.div>
    </div>
  );
}