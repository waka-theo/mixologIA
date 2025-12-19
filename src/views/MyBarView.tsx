import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CocktailCard } from '../components/CocktailCard';
import { Spinner } from '../components/Spinner';
import { useApp } from '../context/AppContext';
import { getIngredientsList, filterByMultipleIngredients } from '../lib/cocktailApi';

export function MyBarView() {
  const { setCurrentView, setSelectedCocktail } = useApp();
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredientsList();
        const ingredients = data.map(d => d.strIngredient1).filter(Boolean);
        setAllIngredients(ingredients);
        setFilteredIngredients(ingredients);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoadingIngredients(false);
      }
    }
    loadIngredients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allIngredients
        .filter(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients(allIngredients);
    }
  }, [searchQuery, allIngredients]);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) return;

    setLoading(true);
    try {
      const cocktails = await filterByMultipleIngredients(selectedIngredients);
      setResults(cocktails);
    } catch (error) {
      console.error('Failed to search cocktails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCocktailClick = (cocktail: any) => {
    setSelectedCocktail(cocktail);
    setCurrentView('detail');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-electric-cyan text-glow-cyan">
          Mon Bar Virtuel
        </h1>
        <p className="text-white/70">Sélectionnez les ingrédients que vous avez</p>
      </div>

      <div className="glass-morphism rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold uppercase tracking-wide text-white text-sm">
            Ingrédients disponibles
          </h3>
          <span className="text-xs text-white/60">
            {filteredIngredients.length} ingrédient{filteredIngredients.length > 1 ? 's' : ''}
          </span>
        </div>

        <Input
          placeholder="Rechercher un ingrédient..."
          leftIcon={<Search className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loadingIngredients ? (
          <div className="py-8">
            <Spinner />
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-1 pr-2">
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  onClick={() => handleAddIngredient(ingredient)}
                  disabled={selectedIngredients.includes(ingredient)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white/80 text-sm"
                >
                  {ingredient}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-white/50">
                Aucun ingrédient trouvé
              </div>
            )}
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="glass-morphism rounded-xl p-6 space-y-4">
          <h3 className="font-bold uppercase tracking-wide text-white">Ingrédients sélectionnés</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ingredient => (
              <div
                key={ingredient}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-neon-purple/20 border border-neon-purple text-white"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="primary" size="md" onClick={handleSearch} loading={loading}>
            Trouver des cocktails
          </Button>
        </div>
      )}

      {loading && (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white">
            Résultats ({results.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((cocktail: any) => (
              <CocktailCard
                key={cocktail.idDrink}
                id={cocktail.idDrink}
                name={cocktail.strDrink}
                image={cocktail.strDrinkThumb}
                onClick={() => handleCocktailClick(cocktail)}
                badge={`${cocktail.matchPercentage}% - ${cocktail.missingIngredients === 0 ? 'Parfait!' : `Il manque ${cocktail.missingIngredients} ingrédient${cocktail.missingIngredients > 1 ? 's' : ''}`}`}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && selectedIngredients.length > 0 && results.length === 0 && (
        <div className="text-center py-12 text-white/50">
          Aucun cocktail trouvé avec ces ingrédients
        </div>
      )}

      {selectedIngredients.length === 0 && !loading && (
        <div className="text-center py-12 text-white/50">
          Sélectionnez des ingrédients pour commencer
        </div>
      )}
    </div>
  );
}
