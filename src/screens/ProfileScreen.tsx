import React from 'react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storage';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  RotateCcw, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  Award
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    switchDemoRole, 
    lang, 
    setLang, 
    t, 
    isOnline, 
    toggleOnlineSimulation, 
    offlineQueueCount, 
    triggerSync, 
    resetAppDemo,
    showToast 
  } = useApp();

  const userPonds = storageService.getPonds(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#2E7D4F] to-[#14342A] border-4 border-[#F2A900] flex items-center justify-center text-4xl shadow-md shrink-0">
            {currentUser.role === 'admin' ? '👔' : '👨‍🌾'}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-heading font-bold text-2xl text-[#14342A]">
                {currentUser.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {currentUser.role === 'admin' ? 'Company Admin' : 'Registered Farmer'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D4F]" />
              <span>{currentUser.district}, {currentUser.state}</span>
              <span className="mx-1">•</span>
              <span>Primary: {currentUser.primarySpecies}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </span>
            </div>
          </div>

          {/* Role Switcher Action */}
          <button
            onClick={() => switchDemoRole(currentUser.role === 'admin' ? 'farmer' : 'admin')}
            className="px-4 py-2 rounded-xl bg-sand-50 hover:bg-emerald-50 text-[#14342A] border border-slate-300 hover:border-[#2E7D4F] text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-[#F2A900]" />
            <span>Switch to {currentUser.role === 'admin' ? 'Farmer View' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>

      {/* 2. Farmer Ponds Configuration */}
      {currentUser.role === 'farmer' && (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#14342A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2E7D4F]" />
              <span>My Managed Ponds ({userPonds.length})</span>
            </h2>
            <span className="text-xs text-slate-500">Nagapattinam Estuary Cluster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userPonds.map(pond => (
              <div key={pond.id} className="p-4 rounded-2xl bg-sand-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#14342A]">
                  <span>{pond.name}</span>
                  <span className="text-emerald-700">{pond.pondNumber}</span>
                </div>
                <div className="text-slate-600 flex justify-between">
                  <span>Area: {pond.areaAcres} Acres</span>
                  <span>Depth: {pond.depthMeters} m</span>
                  <span className="capitalize">{pond.waterType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Language & Accessibility Preferences */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
        <h2 className="font-heading font-bold text-lg text-[#14342A] flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#2E7D4F]" />
          <span>Language Preferences</span>
        </h2>
        
        <p className="text-xs text-slate-600">
          Switch the app interface between English and Tamil (தமிழ்) for easy comprehension:
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLang('en')}
            className={`p-4 rounded-2xl border-2 font-bold text-sm transition flex items-center justify-between ${
              lang === 'en'
                ? 'border-[#2E7D4F] bg-emerald-50 text-[#14342A]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>English (Default)</span>
            {lang === 'en' && <span className="text-[#2E7D4F]">✓</span>}
          </button>

          <button
            onClick={() => setLang('ta')}
            className={`p-4 rounded-2xl border-2 font-bold text-sm transition flex items-center justify-between ${
              lang === 'ta'
                ? 'border-[#2E7D4F] bg-emerald-50 text-[#14342A]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>தமிழ் (Tamil)</span>
            {lang === 'ta' && <span className="text-[#2E7D4F]">✓</span>}
          </button>
        </div>
      </div>

      {/* 4. Offline Sync & Storage Engine */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-[#14342A] flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#2E7D4F]" />
            <span>PWA & Offline Synchronization</span>
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
          }`}>
            {isOnline ? 'Connected' : 'Offline Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Farmers working in remote pond dikes without mobile coverage can log growth data and submit feedback offline. Data is queued locally and synchronizes automatically upon reconnecting.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={toggleOnlineSimulation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {isOnline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
            <span>{isOnline ? 'Simulate Offline Mode' : 'Restore Online Mode'}</span>
          </button>

          {offlineQueueCount > 0 && (
            <button
              onClick={triggerSync}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F2A900] text-[#14342A] text-xs font-bold shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync {offlineQueueCount} Pending Items Now</span>
            </button>
          )}

          <button
            onClick={resetAppDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Seed Data (15 Farmers / 30 Batches)</span>
          </button>
        </div>
      </div>

      {/* 5. Hackathon Submission Info & Credits */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#14342A] to-[#1c493b] text-white space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#F2A900]" />
          <h3 className="font-heading font-bold text-base text-white">
            Euphoria Hackathon — Agri Venture: The Agribusiness Challenge
          </h3>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Built by <strong>Team Connected Minds</strong> for commercial aquaculture farmers across Tamil Nadu. <strong>CHANNA PELLET</strong> combines 20% Fish Meal, 20% Squid Meal, 10% Jawla Meal, digestive enzymes, and essential micronutrients to accelerate growth, reduce baseline culture time from 60 days to 45 days, enhance vibrant market pigmentation, and maximize farm profitability.
        </p>
        <div className="text-[11px] text-emerald-300 pt-1">
          PWA Version 1.0 • Offline Ready • Mobile-First Responsive
        </div>
      </div>

    </div>
  );
};
