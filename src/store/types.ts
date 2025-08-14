import type { rootReducer } from './rootReducer';
import type { store } from './store';

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
