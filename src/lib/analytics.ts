// Analytics and tracking utilities
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface UserProperties {
  id?: string;
  email?: string;
  role?: string;
  plan?: string;
  createdAt?: string;
}

class Analytics {
  private userId?: string;
  private sessionId: string;
  private isEnabled: boolean;
  private queue: AnalyticsEvent[] = [];
  private maxQueueSize = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.initializeSession();
  }

  // Initialize tracking session
  private initializeSession() {
    if (typeof window !== 'undefined') {
      this.sessionId = sessionStorage.getItem('analytics_session') || this.generateSessionId();
      sessionStorage.setItem('analytics_session', this.sessionId);
      
      // Track page views
      this.trackPageView();
      
      // Track session start
      this.track('session_start', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set user identity
  identify(userId: string, properties?: UserProperties) {
    this.userId = userId;
    this.track('user_identified', { userId, ...properties });
  }

  // Track events
  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        page: window.location.pathname,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.addToQueue(event);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 Analytics Event');
      console.log('Event:', eventName);
      console.log('Properties:', properties);
      console.log('User ID:', this.userId);
      console.groupEnd();
    }

    // Send in production
    if (this.isEnabled) {
      this.sendEvent(event);
    }
  }

  // Track page views
  trackPageView(path?: string) {
    const currentPath = path || window.location.pathname;
    this.track('page_view', {
      path: currentPath,
      title: document.title,
      referrer: document.referrer,
    });
  }

  // Track user interactions
  trackClick(element: string, properties?: Record<string, any>) {
    this.track('click', {
      element,
      ...properties,
    });
  }

  trackFormSubmit(formName: string, properties?: Record<string, any>) {
    this.track('form_submit', {
      form: formName,
      ...properties,
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  trackPerformance(metric: string, value: number, properties?: Record<string, any>) {
    this.track('performance', {
      metric,
      value,
      ...properties,
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, properties?: Record<string, any>) {
    this.track('feature_used', {
      feature,
      ...properties,
    });
  }

  // Conversion tracking
  trackConversion(goal: string, value?: number, properties?: Record<string, any>) {
    this.track('conversion', {
      goal,
      value,
      ...properties,
    });
  }

  private addToQueue(event: AnalyticsEvent) {
    this.queue.push(event);
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift(); // Remove oldest event
    }
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // In a real app, send to your analytics service
      // e.g., Google Analytics, Mixpanel, Amplitude, etc.
      
      // Example for Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.name, {
          custom_parameter_1: JSON.stringify(event.properties),
          user_id: event.userId,
          session_id: event.sessionId,
        });
      }

      // Example for custom analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });

      console.log('Analytics event sent:', event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Batch send queued events
  async flushQueue() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Send batch to analytics service
      await this.sendBatch(events);
    } catch (error) {
      console.error('Failed to flush analytics queue:', error);
      // Re-add events to queue on failure
      this.queue.unshift(...events);
    }
  }

  private async sendBatch(events: AnalyticsEvent[]) {
    // Implement batch sending to your analytics service
    console.log('Sending batch of', events.length, 'events');
  }

  // Get analytics data for debugging
  getQueue(): AnalyticsEvent[] {
    return [...this.queue];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getUserId(): string | undefined {
    return this.userId;
  }

  // Enable/disable tracking
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled;
  }
}

// Singleton instance
export const analytics = new Analytics();

// React hook for analytics
import React, { useEffect } from 'react';

export const useAnalytics = () => {
  useEffect(() => {
    // Flush queue when page is about to unload
    const handleBeforeUnload = () => {
      analytics.flushQueue();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    track: analytics.track.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
  };
};

// Higher-order component for automatic page view tracking
export const withAnalytics = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    useAnalytics();
    return React.createElement(Component, props);
  };
};