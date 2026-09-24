import React from 'react';
import { useApp } from '../context/AppContext';
import { FeedbackPromptBanner } from '../components/FeedbackPromptBanner';
import { 
  Sparkles, 
  Layers, 
  Calculator, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Thermometer, 
  Droplets, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    currentUser, 
    setCurrentTab, 
    t, 
    batches, 
    lang 
  } = useApp();

  const userBatches = batches.filter(b => b.userId === currentUser.id);
  const activeBatches = userBatches.filter(b => b.status === 'active');
  const primaryBatch = activeBatches[0] || userBatches[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      
      {/* 1. Farmer Welcome Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A]">
              {t.greeting}, {currentUser.name}!
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {currentUser.district} District • {currentUser.pondCount} Ponds • {currentUser.primarySpecies}
          </p>
        </div>

        {/* 45-Day Cycle Target Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-amber-50 p-3 rounded-2xl border border-emerald-200/80 shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#F2A900] text-[#14342A] flex items-center justify-center font-bold text-lg shrink-0">
            45d
          </div>
          <div>
            <div className="text-xs font-bold text-[#14342A]">
              {t.cycleTarget}
            </div>
            <div className="text-[11px] text-emerald-800">
              {t.baselineComparison}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Feedback Prompt Banner (Day 30 check-in milestone) */}
      <FeedbackPromptBanner />

      {/* 3. Real-time Water & Agronomy Advisory Widget */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#2E7D4F] flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#14342A] flex items-center gap-2">
              <span>{t.advisoryTitle}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Optimal
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.advisoryTemp}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>28.5°C Surface</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>6.3 ppm DO</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">pH 7.8</span>
          </div>
        </div>
      </div>

      {/* 4. Core KPI Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* KPI 1: Active Batches */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.activeBatches}</span>
            <Layers className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
              {activeBatches.length || 3}
            </span>
            <span className="text-xs text-slate-500 ml-1">in culture</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            ● All ponds running smoothly
          </div>
        </div>

        {/* KPI 2: Current Avg Weight */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pond 2 Weight (DOC 32)</span>
            <TrendingUp className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
              22.4g
            </span>
            <span className="text-xs text-slate-500 ml-1">/ 30g goal</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2g vs standard baseline</span>
          </div>
        </div>

        {/* KPI 3: Survival Rate */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.avgSurvival}</span>
            <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
              94.2%
            </span>
          </div>
          <div className="text-[11px] text-[#2E7D4F] font-semibold mt-1">
            Top tier (&gt;92% benchmark)
          </div>
        </div>

        {/* KPI 4: Feed Conversion (FCR) */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.fcrScore}</span>
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
              1.16
            </span>
            <span className="text-xs text-slate-500 ml-1">FCR</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Industry standard: 1.55 – 1.65
          </div>
        </div>

      </div>

      {/* 5. Quick Action Touch Targets (Designed for Mobile & Farmers) */}
      <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80">
        <h3 className="font-heading font-bold text-base text-[#14342A] mb-3">
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            id="quick-action-log"
            onClick={() => setCurrentTab('batches')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-[#14342A] transition transform active:scale-95"
          >
            <div className="w-11 h-11 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center mb-2 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center">{t.logGrowthAction}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Record weekly ABW</span>
          </button>

          <button
            id="quick-action-calc"
            onClick={() => setCurrentTab('calc')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[#14342A] transition transform active:scale-95"
          >
            <div className="w-11 h-11 rounded-full bg-[#F2A900] text-[#14342A] flex items-center justify-center mb-2 shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center">{t.calcFeedAction}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Biomass & temperature</span>
          </button>

          <button
            id="quick-action-order"
            onClick={() => setCurrentTab('orders')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#14342A] transition transform active:scale-95"
          >
            <div className="w-11 h-11 rounded-full bg-[#14342A] text-white flex items-center justify-center mb-2 shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center">{t.orderFeedAction}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">25kg moisture bags</span>
          </button>

          <button
            id="quick-action-feedback"
            onClick={() => setCurrentTab('feedback')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-[#14342A] transition transform active:scale-95"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2E7D4F] to-[#14342A] text-[#F2A900] flex items-center justify-center mb-2 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center">{t.giveFeedbackAction}</span>
            <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">Voice or text review</span>
          </button>

        </div>
      </div>

      {/* 6. Active Culture Batches Progress Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#14342A]">
            Active Pond Batches
          </h3>
          <button
            onClick={() => setCurrentTab('batches')}
            className="text-xs font-bold text-[#2E7D4F] hover:underline flex items-center gap-1"
          >
            <span>View All Batches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBatches.slice(0, 2).map((batch) => {
            const isAquaVigor = batch.feedType === 'aquavigor';
            const targetDays = isAquaVigor ? 45 : 60;
            // Calculate current culture days
            const stockDate = new Date(batch.stockingDate);
            const today = new Date();
            const diffDays = Math.max(1, Math.round((today.getTime() - stockDate.getTime()) / (1000 * 60 * 60 * 24)));
            const progressPercent = Math.min(100, Math.round((diffDays / targetDays) * 100));

            return (
              <div 
                key={batch.id} 
                onClick={() => setCurrentTab('batches')}
                className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80 hover:border-[#2E7D4F] transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#14342A]">{batch.batchName}</h4>
                      {isAquaVigor ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E7D4F] text-[10px] font-bold">
                          CHANNA PELLET (45d)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          Other Feed (60d)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {batch.pondName} • {batch.species} • {batch.stockingCount.toLocaleString()} Stocked
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                    batch.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {batch.status === 'active' ? `DOC ${diffDays}` : 'Harvested'}
                  </span>
                </div>

                {/* Progress bar towards target harvest */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Culture Progress</span>
                    <span className="font-bold text-[#14342A]">
                      Day {diffDays} of {targetDays} Target ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAquaVigor ? 'bg-gradient-to-r from-[#2E7D4F] to-[#F2A900]' : 'bg-slate-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">ABW</div>
                    <div className="text-sm font-bold text-[#14342A]">{batch.currentWeightG}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Survival</div>
                    <div className="text-sm font-bold text-emerald-600">{batch.currentSurvivalRate}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">FCR</div>
                    <div className="text-sm font-bold text-[#F2A900]">{batch.currentFCR}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
