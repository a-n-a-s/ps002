import { motion } from 'framer-motion';

interface TimelineStep {
  time: string;
  action: string;
  details: string;
  status: 'success' | 'failed' | 'in-progress' | 'pending';
  aiReasoning?: string;
}

interface CascadeTimelineProps {
  emergencyId: string;
  steps: TimelineStep[];
}

const statusConfig = {
  success: {
    icon: '✓',
    color: 'text-success',
    bg: 'bg-success-dim',
    animate: '',
  },
  failed: {
    icon: '✗',
    color: 'text-blood',
    bg: 'bg-blood-dim',
    animate: '',
  },
  'in-progress': {
    icon: '●',
    color: 'text-warning',
    bg: 'bg-warning-dim',
    animate: 'animate-ai-think',
  },
  pending: {
    icon: '○',
    color: 'text-text-muted',
    bg: 'bg-white/5',
    animate: '',
  },
} as const;

export function CascadeTimeline({ emergencyId, steps }: CascadeTimelineProps) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4 px-2">
        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
          TIMELINE —
        </span>
        <span className="text-xs font-semibold text-text-primary">
          {emergencyId}
        </span>
      </div>

      <div className="space-y-1">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start gap-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center
                  text-xs font-bold ${config.bg} ${config.color}
                  ${step.status === 'in-progress' ? config.animate : ''}
                `}
              >
                {config.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">
                    {step.time}
                  </span>
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {step.action}
                  </span>
                  {step.status === 'success' && (
                    <span className="text-xs text-success">✓</span>
                  )}
                  {step.status === 'failed' && (
                    <span className="text-xs text-blood">✗</span>
                  )}
                </div>
                <span className="text-xs text-text-muted block">
                  {step.details}
                </span>
                {step.aiReasoning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-1 text-xs text-ai italic"
                  >
                    "{step.aiReasoning}"
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {steps.some((s) => s.status === 'success') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: steps.length * 0.15 + 0.3 }}
          className="mt-4 px-3 py-2 rounded-lg bg-success-dim border border-success/30 text-xs font-semibold text-success"
        >
          ✓ Request fulfilled — Donor en route
        </motion.div>
      )}
    </div>
  );
}