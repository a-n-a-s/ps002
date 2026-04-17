import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accept' | 'danger';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-[#FF003C] to-[#FF4D79] text-white hover:shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/10',
  secondary: 'bg-transparent border border-blood/50 text-blood hover:bg-blood/10 hover:shadow-[0_0_15px_rgba(255,0,60,0.3)]',
  ghost: 'bg-transparent text-text-sub hover:bg-white/5 border border-white/10 hover:border-white/30',
  accept: 'bg-gradient-to-r from-[#00FF66] to-[#00CC52] text-white text-base font-bold px-9 py-[18px] rounded-xl hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(0,255,102,0.6)] border border-white/10',
  danger: 'bg-transparent border border-white/20 text-text-sub hover:bg-white/5 hover:border-blood/50 hover:text-blood hover:shadow-[0_0_15px_rgba(255,0,60,0.2)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`
          ${variants[variant]}
          px-6 py-3 rounded-lg font-semibold text-sm
          transition-all duration-150 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';