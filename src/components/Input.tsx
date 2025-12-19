import { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: boolean;
}

export function Input({ leftIcon, rightIcon, error, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          {leftIcon}
        </div>
      )}
      <input
        className={`w-full glass-morphism rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-electric-cyan transition-all ${
          leftIcon ? 'pl-10' : ''
        } ${rightIcon ? 'pr-10' : ''} ${
          error ? 'ring-2 ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
