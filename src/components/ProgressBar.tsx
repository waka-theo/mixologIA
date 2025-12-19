interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
}

export function ProgressBar({ current, max, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`w-full bg-white/10 rounded-full h-3 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-electric-cyan to-neon-purple transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
