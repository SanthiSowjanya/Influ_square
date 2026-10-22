import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { CreateProfileModal } from '../modals/CreateProfileModal';
import { CloudConfigModal } from '../modals/CloudConfigModal';
import { getStoredAuthUser, signOutUser } from '../../lib/supabaseAuth';
import {
  Sparkles,
  Layers,
  MessageSquare,
  DollarSign,
  User,
  Search,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  RotateCcw,
  Compass,
  Plus,
  Cloud,
  Database,
  LogIn,
  LogOut,
  FileText
} from 'lucide-react';

const PUBLIC_VIEWS: ActiveView[] = [
  'landing',
  'how-it-works',
  'public-campaigns',
  'public-creators',
  'terms-of-service',
  'privacy-policy',
  'login',
  'register'
];

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    currentCreator,
    currentBrand,
    allCreators,
    allBrands,
    switchCreatorPersona,
    switchBrandPersona,
    cloudStatus,
    conversations,
    resetDemoData,
    addToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [createProfileDefaultRole, setCreateProfileDefaultRole] = useState<'creator' | 'brand'>('creator');
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  const authUser = getStoredAuthUser();
  const isPublicView = PUBLIC_VIEWS.includes(activeView);
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleLogout = async () => {
    await signOutUser();
    addToast('info', 'Signed Out', 'You have been securely signed out.');
    setActiveView('login');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'creator') setActiveView('creator-dashboard');
    else if (role === 'brand') setActiveView('brand-dashboard');
    else if (role === 'admin') setActiveView('admin-dashboard');
  };

  const goToDashboard = () => {
    if (currentRole === 'creator') setActiveView('creator-dashboard');
    else if (currentRole === 'brand') setActiveView('brand-dashboard');
    else if (currentRole === 'admin') setActiveView('admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-xs">
      {/* Top Banner: Cloud Status & Prototype Disclaimer */}
      <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 px-4 py-1.5 text-xs text-center border-b border-purple-100 text-slate-700 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-purple-900">Marketplace Database & Cloud:</span>
        <button
          onClick={() => setIsCloudModalOpen(true)}
          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border flex items-center gap-1 cursor-pointer transition-colors ${
            cloudStatus.isConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Cloud className="w-3 h-3" />
          {cloudStatus.isConnected ? 'Free Supabase Cloud Active' : 'Connect Free Supabase Cloud'}
        </button>
        <span className="hidden sm:inline text-slate-500">• INR (₹) payments & Meta Graph API ready</span>
        <button
          onClick={resetDemoData}
          className="ml-2 inline-flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 font-medium underline cursor-pointer"
          title="Reset simulated data to default"
        >
          <RotateCcw className="w-3 h-3" /> Reset Demo
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Public Switcher */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors">
                  Creator<span className="text-purple-600">Sphere</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium">
                  Marketplace
                </span>
              </div>
            </button>

            {activeView !== 'landing' && (
              <button
                onClick={() => setActiveView('landing')}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors font-medium cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Landing View
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {isPublicView ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveView('how-it-works')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeView === 'how-it-works'
                      ? 'bg-purple-100/80 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  How It Works
                </button>
                <button
                  onClick={() => setActiveView('public-campaigns')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeView === 'public-campaigns'
                      ? 'bg-purple-100/80 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Find Campaigns
                </button>
                <button
                  onClick={() => setActiveView('public-creators')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeView === 'public-creators'
                      ? 'bg-purple-100/80 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Explore Creators
                </button>
                <button
                  onClick={() => setActiveView('terms-of-service')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeView === 'terms-of-service' || activeView === 'privacy-policy'
                      ? 'bg-purple-100/80 text-purple-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Trust & Compliance
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span className="font-semibold text-slate-700">
                  {currentRole === 'creator' ? 'Creator Studio Portal' : currentRole === 'brand' ? 'Brand Workspace' : 'Trust & Safety Console'}
                </span>
                <span className="text-slate-400">|</span>
                <button
                  onClick={() => setActiveView('landing')}
                  className="text-purple-700 hover:text-purple-900 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Public Marketplace
                </button>
              </div>
            )}
          </nav>

          {/* Right Action: Persona Switcher, Create Profile & Cloud */}
          <div className="flex items-center gap-2.5">
            {/* Quick Profile Creation Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateProfileDefaultRole(currentRole === 'brand' ? 'brand' : 'creator');
                setIsCreateProfileOpen(true);
              }}
              className="hidden md:inline-flex"
            >
              <Plus className="w-3.5 h-3.5" /> + New Profile
            </Button>

            {/* Interactive Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all shadow-xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={
                      currentRole === 'creator'
                        ? currentCreator.avatarUrl
                        : currentRole === 'brand'
                        ? currentBrand.organization.logoUrl
                        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                    }
                    alt="Active Persona"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-slate-900 leading-tight">
                    {currentRole === 'creator'
                      ? currentCreator.fullName
                      : currentRole === 'brand'
                      ? currentBrand.organization.name
                      : 'Admin Moderator'}
                  </p>
                  <p className="text-[10px] text-purple-600 font-medium capitalize">
                    {currentRole === 'creator' ? 'Creator Mode' : currentRole === 'brand' ? 'Brand Mode' : 'Admin'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {/* Dynamic Dropdown Menu with Multiple Profiles */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-fade-in max-h-[85vh] overflow-y-auto">
                  {/* Creators Section */}
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Creators ({allCreators.length})
                    </p>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCreateProfileDefaultRole('creator');
                        setIsCreateProfileOpen(true);
                      }}
                      className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Creator
                    </button>
                  </div>

                  <div className="space-y-1 mb-3">
                    {allCreators.map((creator) => {
                      const isActive = currentRole === 'creator' && currentCreator.id === creator.id;
                      return (
                        <button
                          key={creator.id}
                          onClick={() => {
                            switchCreatorPersona(creator.id);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-purple-50 border border-purple-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={creator.avatarUrl}
                            alt={creator.fullName}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-900 truncate">{creator.fullName}</p>
                              {isActive && <span className="text-[10px] text-purple-700 font-bold bg-purple-100/80 px-1.5 py-0.5 rounded-md">Active</span>}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{creator.handle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Brands Section */}
                  <div className="px-2 py-1.5 border-t border-slate-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Brands ({allBrands.length})
                    </p>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setCreateProfileDefaultRole('brand');
                        setIsCreateProfileOpen(true);
                      }}
                      className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Brand
                    </button>
                  </div>

                  <div className="space-y-1 mb-3">
                    {allBrands.map((brand) => {
                      const isActive = currentRole === 'brand' && currentBrand.id === brand.id;
                      return (
                        <button
                          key={brand.id}
                          onClick={() => {
                            switchBrandPersona(brand.id);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-indigo-50 border border-indigo-200'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={brand.organization.logoUrl}
                            alt={brand.organization.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-900 truncate">{brand.organization.name}</p>
                              {isActive && <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/80 px-1.5 py-0.5 rounded-md">Active</span>}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{brand.jobTitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Admin Console & Cloud Settings */}
                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        currentRole === 'admin'
                          ? 'bg-amber-50 border border-amber-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xs">
                        T&S
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">Trust & Safety Console</p>
                        <p className="text-[10px] text-slate-500">Moderation & Verifications</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setIsCloudModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-slate-900">Free Cloud Database</p>
                          <Badge variant={cloudStatus.isConnected ? 'success' : 'outline'} size="sm">
                            {cloudStatus.isConnected ? 'Connected' : 'Setup'}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">Supabase Cloud Sync</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Launch App or Public Site or Auth Button */}
            {isPublicView ? (
              authUser ? (
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={goToDashboard}
                  className="hidden sm:inline-flex"
                >
                  Enter Portal
                </Button>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveView('login')}
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => setActiveView('register')}
                  >
                    Get Started
                  </Button>
                </div>
              )
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView('landing')}
                >
                  Public Site
                </Button>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Active Profile:</span>
            <span className="text-xs text-purple-700 font-bold">
              {currentRole === 'creator' ? currentCreator.fullName : currentBrand.organization.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateProfileDefaultRole('creator');
                setIsCreateProfileOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              + New Creator
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCreateProfileDefaultRole('brand');
                setIsCreateProfileOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              + New Brand
            </Button>
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                setActiveView('how-it-works');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => {
                setActiveView('public-campaigns');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Search className="w-4 h-4 text-purple-600" />
              <span>Find Campaigns</span>
            </button>
            <button
              onClick={() => {
                setActiveView('public-creators');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <User className="w-4 h-4 text-purple-600" />
              <span>Explore Creators</span>
            </button>
            <button
              onClick={() => {
                setActiveView('terms-of-service');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => {
                setActiveView('privacy-policy');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Privacy Policy</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {authUser ? (
              <div className="flex gap-2">
                <Button
                  variant="gradient"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    goToDashboard();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Enter Portal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-rose-600"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setActiveView('login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setActiveView('register');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCloudModalOpen(true);
              }}
              className="w-full p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" /> Supabase Cloud Database Settings
            </button>
          </div>
        </div>
      )}

      {/* Profile & Cloud Modals */}
      <CreateProfileModal
        isOpen={isCreateProfileOpen}
        onClose={() => setIsCreateProfileOpen(false)}
        defaultRole={createProfileDefaultRole}
      />

      <CloudConfigModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />
    </header>
  );
};
