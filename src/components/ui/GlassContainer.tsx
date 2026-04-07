import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hover ? { 
        scale: 1.01, 
        boxShadow: "0 0 25px rgba(124, 58, 237, 0.4)",
        transition: { duration: 0.1 } 
      } : {}}
      className={`terminal-box rounded-lg p-6 relative group overflow-hidden ${className}`}
      {...props}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      
      {/* Scanline sub-effect for container */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-1 w-full -top-full group-hover:animate-[scan_2s_linear_infinite] pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
