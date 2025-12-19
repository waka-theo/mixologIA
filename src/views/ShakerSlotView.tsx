import { useState } from 'react';
import { Wine, Shuffle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { getRandomCocktail } from '../lib/cocktailApi';
import { updateBadgeProgress, unlockBadge } from '../lib/supabase';
import { createChallenge } from '../lib/supabase';

export function ShakerSlotView() {
  const {
    setCurrentView,
    setSelectedCocktail,
    userId,
    slotUsageCount,
    incrementSlotUsage,
    addToast,
    refreshBadges,
    refreshChallenge,
    badges
  } = useApp();

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [reels, setReels] = useState(['🍸', '🍹', '🥃']);

  const cocktailIcons = ['🍸', '🍹', '🥃', '🍷', '🍾', '🥂'];

  const handleSpin = async () => {
    setSpinning(true);
    setResult(null);

    const spinInterval = setInterval(() => {
      setReels([
        cocktailIcons[Math.floor(Math.random() * cocktailIcons.length)],
        cocktailIcons[Math.floor(Math.random() * cocktailIcons.length)],
        cocktailIcons[Math.floor(Math.random() * cocktailIcons.length)],
      ]);
    }, 100);

    try {
      const cocktail = await getRandomCocktail();

      setTimeout(() => {
        clearInterval(spinInterval);
        setReels(['🍸', '🍸', '🍸']);
        setResult(cocktail);
        setSpinning(false);

        incrementSlotUsage();

        const newCount = slotUsageCount + 1;
        if (userId) {
          updateBadgeProgress(userId, 'aventurier_hasard', newCount);

          if (newCount >= 10) {
            const badge = badges.find(b => b.badge_type === 'aventurier_hasard');
            if (badge && !badge.unlocked_at) {
              unlockBadge(userId, 'aventurier_hasard');
              addToast('success', 'Badge débloqué: Aventurier du Hasard!');
              refreshBadges();
            }
          }
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to get random cocktail:', error);
      clearInterval(spinInterval);
      setSpinning(false);
      addToast('error', 'Erreur lors du tirage');
    }
  };

  const handleViewRecipe = () => {
    setSelectedCocktail(result);
    setCurrentView('detail');
  };

  const handleStartChallenge = async () => {
    if (!userId || !result) return;

    try {
      await createChallenge(userId, result.idDrink, result.strDrink);
      await refreshChallenge();
      addToast('info', 'Défi accepté! Vous avez 5 minutes.');
      setSelectedCocktail(result);
      setCurrentView('detail');
    } catch (error) {
      console.error('Failed to create challenge:', error);
      addToast('error', 'Erreur lors de la création du défi');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-neon-purple text-glow-purple">
          Machine à Cocktails
        </h1>
        <p className="text-white/70">Laissez le hasard décider de votre prochaine découverte</p>
      </div>

      <Card className="p-8" hover={false}>
        <div className="space-y-8">
          <div className="flex justify-center items-center gap-4">
            {reels.map((reel, index) => (
              <div
                key={index}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-xl glass-morphism flex items-center justify-center text-6xl md:text-7xl ${
                  spinning ? 'animate-spin-slow' : ''
                }`}
              >
                {reel}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSpin}
              disabled={spinning}
              loading={spinning}
              className="min-w-[200px]"
            >
              <Shuffle className="w-5 h-5" />
              {spinning ? 'Tirage en cours...' : 'SPIN'}
            </Button>
          </div>

          <div className="text-center text-white/50 text-sm">
            Tirages effectués: {slotUsageCount}
          </div>
        </div>
      </Card>

      {result && !spinning && (
        <Card className="p-8" hover={false}>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Wine className="w-6 h-6 text-electric-cyan" />
              <h2 className="text-2xl font-bold uppercase tracking-wide text-electric-cyan">
                Résultat
              </h2>
            </div>

            <div className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden">
              <img
                src={result.strDrinkThumb}
                alt={result.strDrink}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2">{result.strDrink}</h3>
              {result.strCategory && (
                <p className="text-white/60">{result.strCategory}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="md" onClick={handleViewRecipe}>
                Voir la recette
              </Button>
              <Button variant="secondary" size="md" onClick={handleStartChallenge}>
                Défi 5 minutes
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
