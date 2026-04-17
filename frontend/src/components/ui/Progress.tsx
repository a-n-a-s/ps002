type ProgressVariant = 'critical' | 'warning' | 'success';

interface ProgressProps {
  value: number;
  variant?: ProgressVariant;
  className?: string;
}

const colors = {
  critical: 'bg-blood',
  warning: 'bg-warning',
  success: 'bg-success',
};

export function Progress({ value, variant = 'success', className = '' }: ProgressProps) {
  return (
    <div className={`h-[3px] bg-white/10 rounded-full overflow-hidden mt-2 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colors[variant]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}