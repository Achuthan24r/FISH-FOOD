import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  Globe, 
  Sparkles,
  ArrowRight,
  Fish,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_USERS } from '../services/storage';

export const AuthScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { setCurrentUser, lang, setLang, t, showToast } = useApp();

  const [authMode, setAuthMode] = useState<'otp' | 'email' | 'register'>('otp');
  const [phoneNumber, setPhoneNumber] = useState('9840123456');
  const [email, setEmail] = useState('murugan.aqua@gmail.com');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('4521');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('Nagapattinam');
  const [regSpecies, setRegSpecies] = useState('Vannamei Shrimp');
  const [regPondCount, setRegPondCount] = useState(3);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setOtpSent(true);
    showToast('OTP sent! Use demo code: 4521', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '4521' && otpCode.length < 4) {
      showToast('Please enter the 4-digit OTP code', 'error');
      return;
    }
    // Log in as Murugan or admin based on number
    if (phoneNumber.includes('94440')) {
      setCurrentUser(INITIAL_USERS[1]); // Admin
    } else {
      setCurrentUser(INITIAL_USERS[0]); // Murugan
    }
    showToast('Login successful! Vanakkam.', 'success');
    if (onComplete) onComplete();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      setCurrentUser(INITIAL_USERS[1]);
    } else {
      setCurrentUser(INITIAL_USERS[0]);
    }
    showToast('Signed in successfully!', 'success');
    if (onComplete) onComplete();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      showToast('Please enter your full name and phone number', 'error');
      return;
    }
    const newUser = {
      role: 'farmer' as const,
      name: regName,
      phone: `+91 ${regPhone}`,
      email: `${regName.toLowerCase().replace(/\s+/g, '')}@aquavigor.farm`,
      district: regDistrict,
      state: 'Tamil Nadu',
      preferredLang: lang,
      pondCount: regPondCount,
      primarySpecies: regSpecies,
      createdAt: new Date().toISOString()
    };
    // Save
    import('../services/storage').then(({ storageService }) => {
      const created = storageService.registerUser(newUser);
      setCurrentUser(created);
      showToast('Account created successfully!', 'success');
      if (onComplete) onComplete();
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] flex flex-col justify-center items-center px-4 py-8">
      {/* Background Decorative Graphic */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden">
        
        {/* Brand Header */}
        <div className="bg-[#14342A] p-6 text-white text-center relative">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-full text-emerald-200 transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#F2A900]" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#2E7D4F] to-[#14342A] border-2 border-[#F2A900] flex items-center justify-center shadow-lg text-2xl">
            🐟
          </div>

          <h2 className="font-heading font-black text-2xl text-[#F2A900] tracking-wider">
            CHANNA PELLET
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xs mx-auto">
            {t.appTagline}
          </p>

          <div className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-[#F2A900]/20 border border-[#F2A900]/40 text-[#F2A900] text-[10px] font-bold uppercase tracking-wider">
            {t.teamCredit}
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6">
          
          {/* Quick Demo Logins for Hackathon Judges */}
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#14342A] mb-2">
              <Sparkles className="w-4 h-4 text-[#F2A900]" />
              <span>{t.quickDemoTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="btn-demo-farmer"
                type="button"
                onClick={() => {
                  setCurrentUser(INITIAL_USERS[0]);
                  showToast('Signed in as Farmer: Murugan Ramanathan', 'success');
                  if (onComplete) onComplete();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-semibold shadow-sm transition"
              >
                <span>👨‍🌾</span>
                <span>{t.demoFarmerBtn}</span>
              </button>
              <button
                id="btn-demo-admin"
                type="button"
                onClick={() => {
                  setCurrentUser(INITIAL_USERS[1]);
                  showToast('Signed in as Company Admin: Dr. S. Anbarasan', 'success');
                  if (onComplete) onComplete();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#14342A] hover:bg-[#1c493b] text-[#F2A900] text-xs font-bold shadow-sm transition"
              >
                <span>👔</span>
                <span>{t.demoAdminBtn}</span>
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5 text-xs font-semibold">
            <button
              onClick={() => { setAuthMode('otp'); setOtpSent(false); }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'otp' ? 'bg-white text-[#14342A] shadow-sm font-bold' : 'text-slate-500'
              }`}
            >
              Phone + OTP
            </button>
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'email' ? 'bg-white text-[#14342A] shadow-sm font-bold' : 'text-slate-500'
              }`}
            >
              Email Fallback
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                authMode === 'register' ? 'bg-white text-[#14342A] shadow-sm font-bold' : 'text-slate-500'
              }`}
            >
              New Farmer
            </button>
          </div>

          {/* 1. Phone + OTP Auth Form */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.mobilePhone}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D4F] focus:ring-1 focus:ring-[#2E7D4F] text-sm text-slate-900 outline-none"
                        placeholder="98401 23456"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Default demo farmer: 9840123456 • Admin: 9444099999
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span>{t.sendOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between">
                    <span>OTP sent to +91 {phoneNumber}</span>
                    <span className="font-bold text-[#2E7D4F]">Demo OTP: 4521</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.enterOtp}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest text-xl font-bold py-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D4F] focus:ring-1 focus:ring-[#2E7D4F] outline-none"
                      placeholder="4521"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                    >
                      Change Number
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition"
                    >
                      {t.verifyLogin}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. Email Fallback Auth Form */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D4F] focus:ring-1 focus:ring-[#2E7D4F] text-sm text-slate-900 outline-none"
                    placeholder="farmer@aquavigor.agri"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Use admin@aquavigor.agri for Admin view
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Demo: any text)
                </label>
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-sm font-bold shadow-md transition"
              >
                Sign In with Email
              </button>
            </form>
          )}

          {/* 3. New Farmer Registration Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.farmerNameLabel}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. S. Kumaravel"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2E7D4F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.mobilePhone}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit phone"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2E7D4F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.villageDistrictLabel}
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="Nagapattinam">Nagapattinam</option>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Cuddalore">Cuddalore</option>
                    <option value="Ramanathapuram">Ramanathapuram</option>
                    <option value="Thoothukudi">Thoothukudi</option>
                    <option value="Mayiladuthurai">Mayiladuthurai</option>
                    <option value="Tiruvallur">Tiruvallur</option>
                    <option value="Chengalpattu">Chengalpattu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.primarySpeciesLabel}
                  </label>
                  <select
                    value={regSpecies}
                    onChange={(e) => setRegSpecies(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                  >
                    <option value="Vannamei Shrimp">Vannamei Shrimp</option>
                    <option value="Black Tiger Shrimp">Black Tiger Shrimp</option>
                    <option value="GIFT Tilapia">GIFT Tilapia</option>
                    <option value="Catfish">Catfish</option>
                    <option value="Asian Seabass">Asian Seabass</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.pondCountLabel}: {regPondCount} Ponds
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={regPondCount}
                  onChange={(e) => setRegPondCount(Number(e.target.value))}
                  className="w-full accent-[#2E7D4F]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition"
              >
                {t.completeProfile}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
