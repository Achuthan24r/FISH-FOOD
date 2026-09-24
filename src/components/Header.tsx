import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  RefreshCw, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchDemoRole, 
    lang, 
    setLang, 
    t, 
    isOnline, 
    toggleOnlineSimulation, 
    offlineQueueCount, 
    triggerSync,
    resetAppDemo,
    currentTab,
    setCurrentTab
  } = useApp();

  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#14342A] text-white shadow-md border-b border-[#255e4d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setCurrentTab(currentUser.role === 'admin' ? 'admin' : 'home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7D4F] to-[#14342A] border border-[#F2A900]/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <span className="text-xl">🐟</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-wider text-[#F2A900]">
                  CHANNA PELLET
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-white/10 text-emerald-200 border border-white/20">
                  2 mm • 45d
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-sans hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Online / Offline Status Badge (Clickable to toggle simulation) */}
            <button
              onClick={toggleOnlineSimulation}
              title={isOnline ? "Online. Click to simulate Offline mode" : "Offline. Click to restore Online"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isOnline 
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60' 
                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/60 animate-pulse'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline</span>
                  {offlineQueueCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                      {offlineQueueCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Offline sync button if pending */}
            {offlineQueueCount > 0 && (
              <button
                onClick={triggerSync}
                title="Sync offline records now"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#F2A900] text-[#14342A] text-xs font-bold hover:bg-[#d99700] transition"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">Sync ({offlineQueueCount})</span>
              </button>
            )}

            {/* Language Switcher: English / தமிழ் */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1c493b] hover:bg-[#255e4d] text-xs font-medium text-white border border-emerald-600/40 transition"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5 text-[#F2A900]" />
              <span className="font-semibold">{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Demo Persona Switcher (For Hackathon Judges) */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#2E7D4F] to-[#1c493b] hover:from-[#3ea369] hover:to-[#2E7D4F] text-xs font-semibold text-white border border-[#F2A900]/50 shadow-sm transition"
            >
              {currentUser.role === 'admin' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-[#F2A900]" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              )}
              <span className="hidden sm:inline">
                {currentUser.role === 'admin' ? 'Admin Panel' : 'Farmer: Murugan'}
              </span>
              <span className="sm:hidden text-[11px] font-bold">
                {currentUser.role === 'admin' ? 'Admin' : 'Farmer'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Demo Persona Switch Modal for Hackathon Judges */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F2A900]" />
                <h3 className="font-heading font-bold text-lg text-[#14342A]">
                  Hackathon Demo Personas
                </h3>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Quickly switch between user roles to evaluate both the Farmer PWA experience and the Company Executive Dashboard:
            </p>

            <div className="space-y-3">
              {/* Persona 1: Farmer Murugan */}
              <div 
                onClick={() => {
                  switchDemoRole('farmer');
                  setShowRoleModal(false);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  currentUser.role === 'farmer'
                    ? 'border-[#2E7D4F] bg-emerald-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                  👨‍🌾
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#14342A]">Murugan Ramanathan</h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Farmer Role
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nagapattinam • 4 Ponds (Vannamei Shrimp) • Active Day 32 Batch with Day-30 check-in
                  </p>
                </div>
              </div>

              {/* Persona 2: Admin Dr. Anbarasan */}
              <div 
                onClick={() => {
                  switchDemoRole('admin');
                  setShowRoleModal(false);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                  currentUser.role === 'admin'
                    ? 'border-[#F2A900] bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-amber-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl shrink-0">
                  👔
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#14342A]">Dr. S. Anbarasan</h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Admin Role
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Team Connected Minds • Full access to 15 Farmers, 30 Batches, 50 Feedback entries & CSV exports
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Demo Data button */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  resetAppDemo();
                  setShowRoleModal(false);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition"
                title="Restore initial 15 farmers, 30 batches and 50 feedback reviews"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Seed Data</span>
              </button>

              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-1.5 bg-[#14342A] text-white text-xs font-semibold rounded-lg hover:bg-[#1c493b] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
