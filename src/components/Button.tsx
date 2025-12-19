import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-bold uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-electric-cyan text-deep-black hover:shadow-neon-cyan hover:scale-105 active:scale-95',
    secondary: 'bg-neon-purple text-white hover:shadow-neon-purple hover:scale-105 active:scale-95',
    success: 'bg-green-500 text-white hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-105 active:scale-95',
    danger: 'bg-red-500 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:scale-105 active:scale-95',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-md',
    md: 'px-6 py-3 text-sm rounded-lg',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
