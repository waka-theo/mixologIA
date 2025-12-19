import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Clock, CheckCircle, XCircle, Wine } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import {
  addFavorite,
  removeFavoriteByCocktailId,
  isFavorite,
  updateBadgeProgress,
  unlockBadge,
  updateChallengeStatus
} from '../lib/supabase';
import { getIngredients } from '../lib/cocktailApi';
import { translateIngredient, translateGlass, translateInstructions, convertMeasurement } from '../lib/translation';

export function CocktailDetailView() {
  const {
    selectedCocktail,
    setCurrentView,
    userId,
    addToast,
    refreshFavorites,
    refreshBadges,
    refreshChallenge,
    addViewedCocktail,
    addViewedCategory,
    viewedCocktails,
    favorites,
    badges,
    activeChallenge
  } = useApp();

  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedIngredients, setTranslatedIngredients] = useState<Array<{ ingredient: string; measure: string }>>([]);
  const [translatedGlass, setTranslatedGlass] = useState('');
  const [translatedInstructions, setTranslatedInstructions] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedCocktail) return;

    async function checkFavorite() {
      if (userId) {
        const isFav = await isFavorite(userId, selectedCocktail.idDrink);
        setFavorited(isFav);
      }
    }

    async function translateContent() {
      const ingredients = getIngredients(selectedCocktail);
      const translated = await Promise.all(
        ingredients.map(async (ing) => ({
          ingredient: await translateIngredient(ing.ingredient),
          measure: convertMeasurement(ing.measure)
        }))
      );
      setTranslatedIngredients(translated);

      if (selectedCocktail.strGlass) {
        const glass = await translateGlass(selectedCocktail.strGlass);
        setTranslatedGlass(glass);
      }

      if (selectedCocktail.strInstructions) {
        const instructions = await translateInstructions(selectedCocktail.strInstructions);
        setTranslatedInstructions(instructions);
      }
    }

    checkFavorite();
    translateContent();

    if (userId) {
      addViewedCocktail(selectedCocktail.idDrink);
      if (selectedCocktail.strCategory) {
        addViewedCategory(selectedCocktail.strCategory);
      }

      const uniqueViews = viewedCocktails.size + 1;
      updateBadgeProgress(userId, 'apprenti_barman', uniqueViews);

      if (uniqueViews >= 5) {
        const badge = badges.find(b => b.badge_type === 'apprenti_barman');
        if (badge && !badge.unlocked_at) {
          unlockBadge(userId, 'apprenti_barman');
          addToast('success', 'Badge débloqué: Apprenti Barman!');
          refreshBadges();
        }
      }
    }
  }, [selectedCocktail]);

  useEffect(() => {
    if (activeChallenge && selectedCocktail && activeChallenge.cocktail_id === selectedCocktail.idDrink) {
      const startTime = new Date(activeChallenge.started_at).getTime();
      const fiveMinutes = 5 * 60 * 1000;
      const endTime = startTime + fiveMinutes;

      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          handleChallengeFail();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeChallenge, selectedCocktail]);

  if (!selectedCocktail) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50">Aucun cocktail sélectionné</p>
      </div>
    );
  }

  const handleFavoriteToggle = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      if (favorited) {
        await removeFavoriteByCocktailId(userId, selectedCocktail.idDrink);
        setFavorited(false);
        addToast('info', 'Retiré des favoris');
      } else {
        await addFavorite(
          userId,
          selectedCocktail.idDrink,
          selectedCocktail.strDrink,
          selectedCocktail.strDrinkThumb
        );
        setFavorited(true);
        addToast('success', 'Ajouté aux favoris!');

        const newFavCount = favorites.length + 1;
        updateBadgeProgress(userId, 'maitre_mixologue', newFavCount);

        if (newFavCount === 1) {
          await unlockBadge(userId, 'premiere_gorgee');
          addToast('success', 'Badge débloqué: Première Gorgée!');
        }

        if (newFavCount >= 20) {
          const badge = badges.find(b => b.badge_type === 'maitre_mixologue');
          if (badge && !badge.unlocked_at) {
            await unlockBadge(userId, 'maitre_mixologue');
            addToast('success', 'Badge débloqué: Maître Mixologue!');
          }
        }
      }

      await refreshFavorites();
      await refreshBadges();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      addToast('error', 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeSuccess = async () => {
    if (!activeChallenge) return;

    try {
      await updateChallengeStatus(activeChallenge.id, 'completed');
      await refreshChallenge();
      addToast('success', 'Défi réussi! Félicitations!');
      setTimeRemaining(null);
    } catch (error) {
      console.error('Failed to complete challenge:', error);
      addToast('error', 'Erreur lors de la validation');
    }
  };

  const handleChallengeFail = async () => {
    if (!activeChallenge) return;

    try {
      await updateChallengeStatus(activeChallenge.id, 'failed');
      await refreshChallenge();
      addToast('info', 'Défi abandonné');
      setTimeRemaining(null);
    } catch (error) {
      console.error('Failed to fail challenge:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isActiveChallenge = activeChallenge && activeChallenge.cocktail_id === selectedCocktail.idDrink;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="secondary" size="sm" onClick={() => setCurrentView('home')}>
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="aspect-video">
          <img
            src={selectedCocktail.strDrinkThumb}
            alt={selectedCocktail.strDrink}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent" />
        </div>

        <button
          onClick={handleFavoriteToggle}
          disabled={loading}
          className="absolute top-4 right-4 p-3 rounded-full bg-deep-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-6 h-6 transition-all ${
              favorited ? 'fill-red-500 text-red-500' : 'text-white/60 hover:text-red-500'
            }`}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-white mb-2">
            {selectedCocktail.strDrink}
          </h1>
          {selectedCocktail.strCategory && (
            <p className="text-electric-cyan text-lg">{selectedCocktail.strCategory}</p>
          )}
        </div>
      </div>

      {isActiveChallenge && timeRemaining !== null && (
        <div className="glass-morphism rounded-xl p-6 border-2 border-neon-purple">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-neon-purple" />
              <span className="font-bold uppercase tracking-wide">Défi en cours</span>
            </div>
            <div className="text-2xl font-mono font-bold text-neon-purple">
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="success" size="sm" onClick={handleChallengeSuccess} className="flex-1">
              <CheckCircle className="w-4 h-4" />
              J'ai réussi!
            </Button>
            <Button variant="danger" size="sm" onClick={handleChallengeFail} className="flex-1">
              <XCircle className="w-4 h-4" />
              J'abandonne
            </Button>
          </div>
        </div>
      )}

      <div className="glass-morphism rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="w-5 h-5 text-electric-cyan" />
          <h2 className="text-2xl font-bold uppercase tracking-wide text-electric-cyan">
            Ingrédients
          </h2>
        </div>
        <ul className="space-y-2">
          {translatedIngredients.map((ing, index) => (
            <li key={index} className="flex items-start gap-3 text-white/80">
              <span className="text-neon-purple font-bold">•</span>
              <span>
                {ing.measure && <span className="font-mono text-electric-cyan">{ing.measure} </span>}
                {ing.ingredient}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {translatedGlass && (
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="font-bold uppercase tracking-wide text-white mb-2">Verre</h3>
          <p className="text-white/80">{translatedGlass}</p>
        </div>
      )}

      {translatedInstructions && (
        <div className="glass-morphism rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-electric-cyan">
            Instructions
          </h2>
          <div className="text-white/80 leading-relaxed">
            {translatedInstructions.split('. ').map((sentence, index) => (
              <p key={index} className="mb-2">
                <span className="font-bold text-neon-purple">{index + 1}.</span> {sentence}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
