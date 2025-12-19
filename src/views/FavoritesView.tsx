import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { CocktailCard } from '../components/CocktailCard';
import { Spinner } from '../components/Spinner';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { removeFavorite, getFavorites } from '../lib/supabase';
import { getCocktailDetails } from '../lib/cocktailApi';

export function FavoritesView() {
  const {
    userId,
    favorites,
    setCurrentView,
    setSelectedCocktail,
    addToast,
    refreshFavorites
  } = useApp();

  const [loading, setLoading] = useState(false);

  const handleRemove = async (favoriteId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await removeFavorite(favoriteId);
      await refreshFavorites();
      addToast('info', 'Favori supprimé');
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      addToast('error', 'Erreur lors de la suppression');
    }
  };

  const handleCocktailClick = async (cocktailId: string) => {
    setLoading(true);
    try {
      const cocktail = await getCocktailDetails(cocktailId);
      setSelectedCocktail(cocktail);
      setCurrentView('detail');
    } catch (error) {
      console.error('Failed to load cocktail:', error);
      addToast('error', 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-electric-cyan text-glow-cyan">
          Mes Favoris
        </h1>
        <p className="text-white/70">Vos cocktails préférés en un seul endroit</p>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-morphism rounded-xl p-12 text-center space-y-6">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-white/70">
            Aucun favori pour l'instant
          </h2>
          <p className="text-white/50">
            Explorez des cocktails et ajoutez-les à vos favoris!
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="md" onClick={() => setCurrentView('mybar')}>
              Mon Bar
            </Button>
            <Button variant="secondary" size="md" onClick={() => setCurrentView('slot')}>
              Machine à Cocktails
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-white/60 text-sm">
            {favorites.length} cocktail{favorites.length > 1 ? 's' : ''} favori{favorites.length > 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <CocktailCard
                  id={fav.cocktail_id}
                  name={fav.cocktail_name}
                  image={fav.cocktail_image}
                  onClick={() => handleCocktailClick(fav.cocktail_id)}
                />
                <button
                  onClick={(e) => handleRemove(fav.id, e)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-deep-black/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-red-500/50 z-10 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
