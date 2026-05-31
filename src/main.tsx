import { App } from '@pages';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/web-react-dos2-recipe-search'>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
