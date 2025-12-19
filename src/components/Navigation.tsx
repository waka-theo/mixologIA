import { Home, Beaker, Dices, Heart, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../context/AppContext';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'mybar', label: 'Mon Bar', icon: Beaker },
  { id: 'slot', label: 'Slot', icon: Dices },
  { id: 'favorites', label: 'Favoris', icon: Heart },
  { id: 'badges', label: 'Badges', icon: Award },
];

export function Navigation() {
  const { currentView, setCurrentView } = useApp();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-morphism border-t border-white/10">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-electric-cyan bg-electric-cyan/10'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 glass-morphism border-r border-white/10 z-40">
        <div className="p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold uppercase tracking-wider text-electric-cyan text-glow-cyan">
              MixologIA
            </h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold uppercase tracking-wide ${
                    isActive
                      ? 'text-electric-cyan bg-electric-cyan/10 shadow-neon-cyan'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
