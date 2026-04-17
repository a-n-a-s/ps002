import { Bell, Settings, History, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui';

interface QuickActionsProps {
  onTestAlert: () => void;
}

export function QuickActions({ onTestAlert }: QuickActionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="primary" 
          onClick={onTestAlert}
          className="h-14 flex items-center justify-center gap-2"
        >
          <Bell className="w-5 h-5" />
          Test Alert
        </Button>

        <Button 
          variant="secondary" 
          className="h-14 flex items-center justify-center gap-2"
        >
          <History className="w-5 h-5" />
          History
        </Button>

        <Button 
          variant="secondary" 
          className="h-14 flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Button>

        <Button 
          variant="secondary" 
          className="h-14 flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          Help
        </Button>
      </div>
    </div>
  );
}
