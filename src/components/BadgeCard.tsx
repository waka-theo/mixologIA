import { LucideIcon, Lock } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface BadgeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string | null;
}

export function BadgeCard({
  icon: Icon,
  title,
  description,
  progress,
  maxProgress,
  unlocked,
  unlockedAt,
}: BadgeCardProps) {
  return (
    <div
      className={`glass-morphism rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
        unlocked
          ? 'shadow-neon-gold hover:scale-[1.02]'
          : 'grayscale opacity-60'
      }`}
    >
      {!unlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-6 h-6 text-white/40" />
        </div>
      )}

      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          unlocked
            ? 'bg-gradient-to-br from-electric-cyan to-neon-purple shadow-neon-gold'
            : 'bg-white/10'
        }`}
      >
        <Icon className={`w-8 h-8 ${unlocked ? 'text-white' : 'text-white/40'}`} />
      </div>

      <h3
        className={`text-xl font-bold uppercase tracking-wide mb-2 ${
          unlocked ? 'text-gold text-glow-gold' : 'text-white/60'
        }`}
      >
        {title}
      </h3>

      <p className="text-white/70 text-sm mb-4">{description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Progression</span>
          <span className={unlocked ? 'text-gold font-bold' : 'text-white/60'}>
            {progress}/{maxProgress}
          </span>
        </div>
        <ProgressBar current={progress} max={maxProgress} />
      </div>

      {unlocked && unlockedAt && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gold">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  );
}
