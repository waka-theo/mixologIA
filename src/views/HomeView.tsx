import { Beaker, Dices } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

export function HomeView() {
  const { setCurrentView, badges, favorites } = useApp();

  const unlockedBadges = badges.filter(b => b.unlocked_at).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-6 py-12">
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-wider text-electric-cyan text-glow-cyan animate-glow-pulse">
          MixologIA
        </h1>
        <div className="flex items-center justify-center gap-8 text-white/70">
          <div className="text-center">
            <div className="text-3xl font-bold text-gold">{unlockedBadges}</div>
            <div className="text-sm uppercase tracking-wide">Badges débloqués</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-purple">{favorites.length}</div>
            <div className="text-sm uppercase tracking-wide">Cocktails favoris</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => setCurrentView('mybar')} className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-electric-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan">
              <Beaker className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-wide text-electric-cyan">
              Mon Bar Virtuel
            </h2>
            <p className="text-white/70">
              Cherchez des cocktails par ingrédients que vous avez à la maison
            </p>
          </div>
        </Card>

        <Card onClick={() => setCurrentView('slot')} className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-electric-cyan flex items-center justify-center shadow-neon-purple">
              <Dices className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-wide text-neon-purple">
              Machine à Cocktails
            </h2>
            <p className="text-white/70">
              Découvrez un cocktail aléatoire et tentez le défi 5 minutes
            </p>
          </div>
        </Card>
      </div>

      <div className="text-center text-white/50 italic">
        Découvrez, collectionnez, maîtrisez l'art du cocktail
      </div>
    </div>
  );
}
