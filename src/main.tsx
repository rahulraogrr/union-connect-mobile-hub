import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { performanceOptimizer } from './lib/performance-optimizer';
import { seoManager } from './lib/seo';

// Initialize performance optimizations
performanceOptimizer.initialize();

// Initialize basic SEO
seoManager.initializeBasicSEO();

// Enable React DevTools in development
if (import.meta.env.DEV) {
  console.log('🚀 Union Connect Hub - Development Mode');
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
