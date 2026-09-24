import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Layers, 
  Calculator, 
  MessageSquare, 
  Sparkles, 
  ShoppingBag, 
  User, 
  BarChart3 
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, t, currentUser } = useApp();

  const farmerNavItems: NavItem[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'batches', label: t.navBatches, icon: Layers },
    { id: 'calc', label: t.navCalculator, icon: Calculator },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquare, badge: 'Key' },
    { id: 'product', label: t.navProduct, icon: Sparkles },
    { id: 'orders', label: t.navOrders, icon: ShoppingBag },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin', label: t.navAdmin, icon: BarChart3 },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquare },
    { id: 'batches', label: t.navBatches, icon: Layers },
    { id: 'orders', label: t.navOrders, icon: ShoppingBag },
    { id: 'product', label: t.navProduct, icon: Sparkles },
    { id: 'calc', label: t.navCalculator, icon: Calculator },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  const navItems = currentUser.role === 'admin' ? adminNavItems : farmerNavItems;

  return (
    <>
      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-safe"
      >
        <div className="grid grid-cols-5 items-center justify-around px-1 py-1.5">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#2E7D4F] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-[#F2A900] text-[#14342A] text-[8px] font-black rounded-full">
                      ★
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 truncate max-w-[62px]">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 w-6 h-1 rounded-full bg-[#2E7D4F]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop / Tablet Sub-Header Navigation Bar */}
      <nav 
        aria-label="Desktop Sub-Navigation"
        className="hidden md:block bg-white border-b border-slate-200 shadow-sm sticky top-[57px] z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#14342A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2A900]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F2A900] text-[#14342A]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected Minds Agri Venture</span>
          </div>
        </div>
      </nav>
    </>
  );
};
