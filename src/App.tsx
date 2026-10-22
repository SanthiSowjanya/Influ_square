import React, { useEffect } from 'react';
import { AppProvider, useApp, ActiveView } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/views/LandingPage';
import { CreatorDashboard } from './components/views/CreatorDashboard';
import { BrandDashboard } from './components/views/BrandDashboard';
import { InboxNegotiationView } from './components/views/InboxNegotiationView';
import { AdminTrustDashboard } from './components/views/AdminTrustDashboard';
import { LoginView } from './components/views/LoginView';
import { RegisterView } from './components/views/RegisterView';
import { HowItWorksView } from './components/views/HowItWorksView';
import { PublicCampaignsView } from './components/views/PublicCampaignsView';
import { PublicCreatorsView } from './components/views/PublicCreatorsView';
import { TermsOfServiceView } from './components/views/TermsOfServiceView';
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { getStoredAuthUser } from './lib/supabaseAuth';

const VALID_VIEWS: ActiveView[] = [
  'landing',
  'how-it-works',
  'public-campaigns',
  'public-creators',
  'terms-of-service',
  'privacy-policy',
  'login',
  'register',
  'creator-dashboard',
  'creator-campaigns',
  'creator-collaborations',
  'creator-inbox',
  'creator-profile',
  'creator-payments',
  'brand-dashboard',
  'brand-campaigns',
  'brand-creators',
  'brand-collaborations',
  'brand-inbox',
  'brand-payments',
  'admin-dashboard'
];

const PROTECTED_PREFIXES = ['creator-', 'brand-', 'admin-'];

const MainViewRouter: React.FC = () => {
  const { activeView, setActiveView, setCurrentRole, addToast } = useApp();

  // Bi-directional URL Hash Synchronization & Route Guard
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace('#', '') as ActiveView;
      if (hash && VALID_VIEWS.includes(hash)) {
        // Route protection check for portal routes
        const isProtected = PROTECTED_PREFIXES.some(prefix => hash.startsWith(prefix));
        const authUser = getStoredAuthUser();

        if (isProtected && !authUser) {
          addToast('info', 'Authentication Required', 'Please sign in or select a demo account to access this portal.');
          setActiveView('login');
          window.location.hash = 'login';
          return;
        }

        if (authUser && isProtected) {
          setCurrentRole(authUser.role);
        }

        if (hash !== activeView) {
          setActiveView(hash);
        }
      }
    };

    // Run on initial mount
    handleHashSync();

    // Listen to browser navigation (back/forward)
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  // Update hash when activeView changes programmatically
  useEffect(() => {
    if (window.location.hash.replace('#', '') !== activeView) {
      window.location.hash = activeView;
    }
    // Scroll to top upon view change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  switch (activeView) {
    case 'landing':
      return <LandingPage />;

    case 'how-it-works':
      return <HowItWorksView />;

    case 'public-campaigns':
      return <PublicCampaignsView />;

    case 'public-creators':
      return <PublicCreatorsView />;

    case 'terms-of-service':
      return <TermsOfServiceView />;

    case 'privacy-policy':
      return <PrivacyPolicyView />;

    case 'login':
      return <LoginView />;

    case 'register':
      return <RegisterView />;

    case 'creator-dashboard':
      return <CreatorDashboard initialTab="overview" />;
    case 'creator-campaigns':
      return <CreatorDashboard initialTab="campaigns" />;
    case 'creator-collaborations':
      return <CreatorDashboard initialTab="collaborations" />;
    case 'creator-profile':
      return <CreatorDashboard initialTab="profile" />;
    case 'creator-payments':
      return <CreatorDashboard initialTab="payments" />;

    case 'brand-dashboard':
      return <BrandDashboard initialTab="overview" />;
    case 'brand-campaigns':
      return <BrandDashboard initialTab="campaigns" />;
    case 'brand-creators':
      return <BrandDashboard initialTab="creators" />;
    case 'brand-collaborations':
      return <BrandDashboard initialTab="collaborations" />;
    case 'brand-payments':
      return <BrandDashboard initialTab="payments" />;

    case 'creator-inbox':
    case 'brand-inbox':
      return <InboxNegotiationView />;

    case 'admin-dashboard':
      return <AdminTrustDashboard />;

    default:
      return <LandingPage />;
  }
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <MainViewRouter />
        </main>
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;
