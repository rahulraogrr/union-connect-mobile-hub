// Performance optimization utilities

export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableCaching: boolean;
  cacheMaxAge: number;
}

export class PerformanceOptimizer {
  private config: PerformanceConfig;

  constructor(config: PerformanceConfig) {
    this.config = config;
  }

  // Lazy load images with intersection observer
  initializeLazyLoading() {
    if (!this.config.enableLazyLoading) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  preloadCriticalResources(resources: string[]) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    });
  }

  // Optimize bundle loading
  optimizeBundleLoading() {
    // Prefetch route chunks
    const routeChunks = [
      '/chunks/login.js',
      '/chunks/dashboard.js',
      '/chunks/profile.js',
    ];

    setTimeout(() => {
      routeChunks.forEach(chunk => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = chunk;
        document.head.appendChild(link);
      });
    }, 2000); // Prefetch after initial load
  }

  // Cache strategies
  implementCaching() {
    if (!this.config.enableCaching) return;

    // Service worker registration for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  // Resource hints
  addResourceHints() {
    const meta = [
      { name: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { name: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
      { name: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'true' },
    ];

    meta.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.name;
      link.href = hint.href;
      if (hint.crossorigin) {
        link.crossOrigin = hint.crossorigin;
      }
      document.head.appendChild(link);
    });
  }

  // Critical CSS inlining
  inlineCriticalCSS(criticalCSS: string) {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  // Font optimization
  optimizeFonts() {
    // Use font-display: swap for better loading performance
    const fontLinks = document.querySelectorAll('link[href*="fonts"]');
    fontLinks.forEach(link => {
      const url = new URL(link.getAttribute('href') || '');
      if (!url.searchParams.has('display')) {
        url.searchParams.set('display', 'swap');
        link.setAttribute('href', url.toString());
      }
    });
  }

  // Initialize all optimizations
  initialize() {
    this.initializeLazyLoading();
    this.optimizeBundleLoading();
    this.implementCaching();
    this.addResourceHints();
    this.optimizeFonts();

    // Monitor performance with built-in performance API
    performance.mark('performance-optimization-start');
  }
}

// Default configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enableCaching: true,
  cacheMaxAge: 31536000, // 1 year
};

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer(defaultPerformanceConfig);