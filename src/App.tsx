import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { ToastContainer } from './components/Toast';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { Spinner } from './components/Spinner';
import { HomeView } from './views/HomeView';
import { MyBarView } from './views/MyBarView';
import { ShakerSlotView } from './views/ShakerSlotView';
import { CocktailDetailView } from './views/CocktailDetailView';
import { FavoritesView } from './views/FavoritesView';
import { BadgesView } from './views/BadgesView';

function AppContent() {
  const { currentView, loading, toasts, removeToast } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-white/70">Chargement de MixologIA...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgeVerificationModal />
      <Navigation />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <main className="min-h-screen lg:ml-64 pb-20 lg:pb-0 p-6">
        {currentView === 'home' && <HomeView />}
        {currentView === 'mybar' && <MyBarView />}
        {currentView === 'slot' && <ShakerSlotView />}
        {currentView === 'detail' && <CocktailDetailView />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'badges' && <BadgesView />}
      </main>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
