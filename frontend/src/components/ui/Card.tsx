import { motion, type HTMLMotionProps } from 'framer-motion';

type CardVariant = 'default' | 'critical' | 'ai';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
}

const variantStyles = {
  default: 'glass-card',
  critical: 'glass-card critical',
  ai: 'glass-card ai',
};

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  return (
    <motion.div
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}