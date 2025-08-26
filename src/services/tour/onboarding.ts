import { store } from '@store/store';
import { createOnboardingController } from './controller/controller';

const controller = createOnboardingController({ store });

/**
 * Start the onboarding tour (async).
 */
export const startOnboardingTour = controller.start;

/**
 * Conditionally start the onboarding tour based on persisted state.
 * Used on app init to auto-run only for users who haven't completed the tour.
 */
export const maybeStartOnboardingTour = controller.maybeStart;
