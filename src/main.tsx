
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainRouter from './router/MainRouter';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainRouter />
  </StrictMode>,
)

