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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      className={`glass rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
