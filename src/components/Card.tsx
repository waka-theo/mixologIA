import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-neon-cyan cursor-pointer'
    : '';

  return (
    <div
      className={`glass-morphism rounded-xl p-6 transition-all duration-300 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
