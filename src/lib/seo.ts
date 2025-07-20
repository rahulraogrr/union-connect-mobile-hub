// SEO optimization utilities
import { analytics } from './analytics';

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  author: string;
  twitterHandle?: string;
  facebookAppId?: string;
  defaultImage: string;
}

export interface PageSEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  canonical?: string;
}

export class SEOManager {
  private config: SEOConfig;

  constructor(config: SEOConfig) {
    this.config = config;
  }

  // Update page meta tags
  updatePageSEO(data: PageSEOData) {
    const title = data.title ? `${data.title} | ${this.config.siteName}` : this.config.defaultTitle;
    const description = data.description || this.config.defaultDescription;
    const keywords = data.keywords || this.config.defaultKeywords;
    const image = data.image || this.config.defaultImage;
    const url = data.url || window.location.href;

    // Update document title
    document.title = title;

    // Update or create meta tags
    this.updateMetaTag('description', description);
    this.updateMetaTag('keywords', keywords.join(', '));
    this.updateMetaTag('author', data.author || this.config.author);

    // Open Graph tags
    this.updateMetaProperty('og:title', title);
    this.updateMetaProperty('og:description', description);
    this.updateMetaProperty('og:image', image);
    this.updateMetaProperty('og:url', url);
    this.updateMetaProperty('og:type', data.type || 'website');
    this.updateMetaProperty('og:site_name', this.config.siteName);

    // Twitter Card tags
    this.updateMetaName('twitter:card', 'summary_large_image');
    this.updateMetaName('twitter:title', title);
    this.updateMetaName('twitter:description', description);
    this.updateMetaName('twitter:image', image);
    if (this.config.twitterHandle) {
      this.updateMetaName('twitter:creator', this.config.twitterHandle);
      this.updateMetaName('twitter:site', this.config.twitterHandle);
    }

    // Article specific tags
    if (data.type === 'article') {
      if (data.publishedTime) {
        this.updateMetaProperty('article:published_time', data.publishedTime);
      }
      if (data.modifiedTime) {
        this.updateMetaProperty('article:modified_time', data.modifiedTime);
      }
      if (data.author) {
        this.updateMetaProperty('article:author', data.author);
      }
    }

    // Canonical URL
    this.updateCanonicalLink(data.canonical || url);

    // Track page view for SEO analytics
    analytics.trackPageView();
  }

  // Update meta tag by name
  private updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  // Update meta tag by property
  private updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  // Update meta tag by name (for Twitter)
  private updateMetaName(name: string, content: string) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  // Update canonical link
  private updateCanonicalLink(href: string) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
  }

  // Add structured data (JSON-LD)
  addStructuredData(data: object) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate sitemap data
  generateSitemapData(routes: Array<{url: string, lastmod?: string, priority?: number}>) {
    return routes.map(route => ({
      url: `${this.config.siteUrl}${route.url}`,
      lastmod: route.lastmod || new Date().toISOString(),
      priority: route.priority || 0.5,
      changefreq: 'weekly'
    }));
  }

  // Add breadcrumb structured data
  addBreadcrumbs(breadcrumbs: Array<{name: string, url: string}>) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.config.siteUrl}${item.url}`
      }))
    };

    this.addStructuredData(structuredData);
  }

  // Initialize basic SEO
  initializeBasicSEO() {
    // Add basic meta tags
    this.updatePageSEO({});

    // Add viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }

    // Add robots meta tag
    this.updateMetaTag('robots', 'index, follow');

    // Add language tag
    document.documentElement.lang = 'en';
  }
}

// Default SEO configuration
export const defaultSEOConfig: SEOConfig = {
  siteName: 'Union Connect Hub',
  siteUrl: 'https://56d8f8b4-0180-4888-8374-0cd70f554036.lovableproject.com',
  defaultTitle: 'Union Connect Hub - Your Digital Union Platform',
  defaultDescription: 'Connect with your union community, access resources, and stay informed with Union Connect Hub.',
  defaultKeywords: ['union', 'community', 'connect', 'platform', 'workers', 'solidarity'],
  author: 'Union Connect Hub Team',
  defaultImage: '/og-image.jpg',
};

// Singleton instance
export const seoManager = new SEOManager(defaultSEOConfig);