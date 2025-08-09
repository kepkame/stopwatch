import { createRoot } from 'react-dom/client';
import './styles/app.scss';
import App from './App.tsx';

import 'focus-visible';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
});

createRoot(document.getElementById('root')!).render(<App />);
