import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';
import { signOutUser } from '../../lib/supabaseAuth';
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  Briefcase,
  MessageSquare,
  User,
  DollarSign,
  Compass,
  LogOut,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardLayoutProps {
  role: UserRole;
  currentTab: string;
  onTabChange: (tabId: string) => void;
  items: SidebarNavItem[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  currentTab,
  onTabChange,
  items,
  children
}) => {
  const {
    currentCreator,
    currentBrand,
    setActiveView,
    conversations,
    addToast
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleLogout = async () => {
    await signOutUser();
    addToast('info', 'Signed Out', 'You have been securely signed out of your session.');
    setActiveView('login');
  };

  const displayName = role === 'creator' ? currentCreator.fullName : currentBrand.fullName;
  const subtitle = role === 'creator' ? currentCreator.handle : currentBrand.organization.name;
  const avatarUrl = role === 'creator' ? currentCreator.avatarUrl : currentBrand.avatarUrl;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              {role === 'creator' ? 'Creator Studio' : 'Brand Workspace'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-rose-600 p-2"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative bg-white w-72 max-w-[85vw] h-full shadow-2xl flex flex-col justify-between p-4 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-black text-slate-900 font-display">CreatorSphere</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Snapshot */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex items-center gap-3">
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{subtitle}</p>
                </div>
              </div>

              {/* Nav Items */}
              <nav className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  const badgeCount = item.id === 'inbox' ? totalUnread : item.badge;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {Boolean(badgeCount && badgeCount > 0) && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setActiveView('landing');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ExternalLink className="w-4 h-4" /> Public Website
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200 transition-all duration-300 sticky top-[97px] h-[calc(100vh-97px)] z-20 overflow-y-auto ${
          isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        }`}
      >
        <div>
          {/* Top Brand & Collapse Toggle */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            {!isCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 font-display text-sm tracking-tight block">
                    CreatorSphere
                  </span>
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                    {role === 'creator' ? 'Creator Portal' : 'Brand Workspace'}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer mx-auto transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className={`my-4 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 ${
            isCollapsed ? 'justify-center p-1.5' : ''
          }`}>
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-purple-200 shrink-0"
            />
            {!isCollapsed && (
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 mt-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const badgeCount = item.id === 'inbox' ? totalUnread : item.badge;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && Boolean(badgeCount && badgeCount > 0) && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}

                  {isCollapsed && Boolean(badgeCount && badgeCount > 0) && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          {!isCollapsed && (
            <button
              onClick={() => setActiveView('landing')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Marketplace</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2 gap-2'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
};
