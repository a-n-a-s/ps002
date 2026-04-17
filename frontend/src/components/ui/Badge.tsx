type BadgeVariant = 'critical' | 'warning' | 'stable' | 'success' | 'info' | 'ai';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants = {
  critical: 'bg-blood-dim text-blood border-blood/30 backdrop-blur-md shadow-[0_0_10px_rgba(255,0,60,0.1)]',
  warning: 'bg-warning-dim text-warning border-warning/30 backdrop-blur-md shadow-[0_0_10px_rgba(255,214,0,0.1)]',
  stable: 'bg-success-dim text-success border-success/30 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,102,0.1)]',
  success: 'bg-success-dim text-success border-success/30 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,102,0.1)]',
  info: 'bg-info-dim text-info border-info/30 backdrop-blur-md shadow-[0_0_10px_rgba(0,229,255,0.1)]',
  ai: 'bg-ai-dim text-ai border-ai/30 backdrop-blur-md shadow-[0_0_10px_rgba(185,77,255,0.1)]',
};

export function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-xs font-semibold uppercase tracking-wider
        border ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}