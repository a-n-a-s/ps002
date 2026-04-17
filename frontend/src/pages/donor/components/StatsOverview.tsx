import { Heart, TrendingUp, Award } from 'lucide-react';
import { ReliabilityBadge } from '../../../components/donor/ReliabilityBadge';
import { Card } from '../../../components/ui';
import { DONOR_PROFILE } from '../../../data/mock';

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-primary border-white/10 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blood/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blood/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-blood" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Lives Saved</span>
          </div>
          <p className="text-5xl font-display font-black text-text-primary">{DONOR_PROFILE.livesSaved}</p>
          <div className="flex items-center gap-2 mt-3 text-success">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+3 this month</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-primary border-white/10 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Reliability Score</span>
          </div>
          <div className="flex items-end gap-4">
            <ReliabilityBadge score={DONOR_PROFILE.reliabilityScore} />
            <div>
              <p className="text-5xl font-display font-black text-text-primary">{DONOR_PROFILE.reliabilityScore}%</p>
              <p className="text-sm text-text-muted mt-1">Top 5% donor</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-primary border-white/10 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-info" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Donation History</span>
          </div>
          <p className="text-5xl font-display font-black text-text-primary">{DONOR_PROFILE.totalDonations}</p>
          <p className="text-sm text-text-muted mt-3">Last donation: Jan 15, 2024</p>
        </div>
      </Card>
    </div>
  );
}
