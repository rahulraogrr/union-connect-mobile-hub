import React, { useEffect } from 'react';
import { seoManager, PageSEOData } from '../lib/seo';

interface SEOHeadProps extends PageSEOData {
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ children, ...seoData }) => {
  useEffect(() => {
    seoManager.updatePageSEO(seoData);
  }, [seoData]);

  return <>{children}</>;
};

// Specific components for different page types
export const HomeSEO: React.FC = () => (
  <SEOHead
    title="Home"
    description="Welcome to Union Connect Hub - Your central platform for union activities, resources, and community connection."
    keywords={['union hub', 'worker platform', 'community', 'solidarity']}
    type="website"
  />
);

export const DashboardSEO: React.FC = () => (
  <SEOHead
    title="Dashboard"
    description="Access your personalized union dashboard with announcements, tickets, and community updates."
    keywords={['union dashboard', 'member portal', 'announcements']}
    type="website"
  />
);

export const LoginSEO: React.FC = () => (
  <SEOHead
    title="Login"
    description="Sign in to your Union Connect Hub account to access member benefits and community features."
    keywords={['union login', 'member signin', 'access']}
    type="website"
  />
);

export const ProfileSEO: React.FC = () => (
  <SEOHead
    title="Profile"
    description="Manage your union profile, update your information, and customize your experience."
    keywords={['union profile', 'member settings', 'account']}
    type="profile"
  />
);

export const TicketsSEO: React.FC = () => (
  <SEOHead
    title="Support Tickets"
    description="Submit and track support tickets for union-related issues and requests."
    keywords={['union support', 'help tickets', 'assistance']}
    type="website"
  />
);

export const AnnouncementsSEO: React.FC = () => (
  <SEOHead
    title="Announcements"
    description="Stay updated with the latest union announcements, news, and important information."
    keywords={['union news', 'announcements', 'updates']}
    type="website"
  />
);

export const PaymentsSEO: React.FC = () => (
  <SEOHead
    title="Payments & Dues"
    description="Manage your union dues, payments, and financial information securely."
    keywords={['union dues', 'payments', 'billing']}
    type="website"
  />
);

export const ConnectSEO: React.FC = () => (
  <SEOHead
    title="Connect"
    description="Connect with fellow union members, join discussions, and build community."
    keywords={['union community', 'member connection', 'networking']}
    type="website"
  />
);