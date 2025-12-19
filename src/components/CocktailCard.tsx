import { Heart } from 'lucide-react';
import { useState } from 'react';

interface CocktailCardProps {
  id: string;
  name: string;
  image: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  badge?: string;
}

export function CocktailCard({
  name,
  image,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  badge,
}: CocktailCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="glass-morphism rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-neon-cyan group relative"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg uppercase tracking-wide text-glow-cyan">
            {name}
          </h3>
        </div>
      </div>

      {onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-deep-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-white/60 hover:text-red-500'
            }`}
          />
        </button>
      )}

      {badge && (
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neon-purple/80 backdrop-blur-sm text-xs font-bold uppercase tracking-wide z-10">
          {badge}
        </div>
      )}
    </div>
  );
}
