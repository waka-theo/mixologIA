import { Droplet, GraduationCap, Trophy, Shuffle, Library } from 'lucide-react';
import { BadgeCard } from '../components/BadgeCard';
import { useApp } from '../context/AppContext';

export function BadgesView() {
  const { badges } = useApp();

  const badgeConfig = [
    {
      type: 'premiere_gorgee',
      icon: Droplet,
      title: 'Première Gorgée',
      description: 'Ajoutez votre premier cocktail favori',
      maxProgress: 1,
    },
    {
      type: 'apprenti_barman',
      icon: GraduationCap,
      title: 'Apprenti Barman',
      description: 'Consultez 5 cocktails différents',
      maxProgress: 5,
    },
    {
      type: 'maitre_mixologue',
      icon: Trophy,
      title: 'Maître Mixologue',
      description: 'Collectionnez 20 favoris',
      maxProgress: 20,
    },
    {
      type: 'aventurier_hasard',
      icon: Shuffle,
      title: 'Aventurier du Hasard',
      description: 'Utilisez la machine à cocktails 10 fois',
      maxProgress: 10,
    },
    {
      type: 'collectionneur',
      icon: Library,
      title: 'Collectionneur',
      description: 'Découvrez tous les types de cocktails',
      maxProgress: 11,
    },
  ];

  const getBadgeData = (type: string) => {
    return badges.find(b => b.badge_type === type);
  };

  const unlockedCount = badges.filter(b => b.unlocked_at).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-gold text-glow-gold">
          Badges
        </h1>
        <p className="text-white/70">
          Vos accomplissements dans l'art du cocktail
        </p>
        <div className="text-2xl font-bold text-electric-cyan">
          {unlockedCount} / {badgeConfig.length} débloqués
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badgeConfig.map((config) => {
          const badge = getBadgeData(config.type);
          return (
            <BadgeCard
              key={config.type}
              icon={config.icon}
              title={config.title}
              description={config.description}
              progress={badge?.progress || 0}
              maxProgress={config.maxProgress}
              unlocked={!!badge?.unlocked_at}
              unlockedAt={badge?.unlocked_at}
            />
          );
        })}
      </div>

      {unlockedCount === badgeConfig.length && (
        <div className="glass-morphism rounded-xl p-8 text-center space-y-4">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold uppercase tracking-wide text-gold text-glow-gold">
            Félicitations!
          </h2>
          <p className="text-white/80 text-lg">
            Vous avez débloqué tous les badges! Vous êtes un véritable maître mixologue!
          </p>
        </div>
      )}
    </div>
  );
}
