import { useEffect } from 'react';
import { maybeStartOnboardingTour } from '@services/tour/onboarding';

export function useOnboardingTour() {
  useEffect(() => {
    // small tick to render the elements of the page
    const timeout = setTimeout(() => maybeStartOnboardingTour(), 300);
    return () => clearTimeout(timeout);
  }, []);
}
