import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import { updateUserAgeVerification } from '../lib/supabase';

export function AgeVerificationModal() {
  const { ageVerified, setAgeVerified, userId, addToast } = useApp();
  const [refused, setRefused] = useState(false);

  const handleYes = async () => {
    if (!userId) return;
    try {
      await updateUserAgeVerification(userId, true);
      setAgeVerified(true);
      addToast('success', 'Bienvenue dans MixologIA!');
    } catch (error) {
      console.error('Failed to update age verification:', error);
      addToast('error', 'Erreur lors de la vérification');
    }
  };

  const handleNo = () => {
    setRefused(true);
  };

  if (ageVerified) return null;

  return (
    <Modal isOpen={!ageVerified} closeable={false}>
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4 animate-float">🍸</div>

        {!refused ? (
          <>
            <h2 className="text-3xl font-bold uppercase tracking-wide text-electric-cyan text-glow-cyan">
              Vérification d'âge
            </h2>
            <p className="text-xl text-white/80">
              Avez-vous 18 ans ou plus ?
            </p>
            <p className="text-sm text-white/60">
              Cette application contient du contenu lié à l'alcool
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Button variant="success" size="lg" onClick={handleYes}>
                Oui, j'ai 18 ans
              </Button>
              <Button variant="danger" size="lg" onClick={handleNo}>
                Non
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold uppercase tracking-wide text-red-500">
              Accès refusé
            </h2>
            <p className="text-lg text-white/80">
              Vous devez avoir 18 ans ou plus pour accéder à cette application.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => window.close()}
            >
              Fermer
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
