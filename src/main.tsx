import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import './styles/app.scss';
import App from './App.tsx';

import 'focus-visible';
import { registerSW } from 'virtual:pwa-register';
import { ThemeEffect } from './features/theme/ThemeEffect';

registerSW({
  immediate: true,
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeEffect />
    <App />
  </Provider>
);
