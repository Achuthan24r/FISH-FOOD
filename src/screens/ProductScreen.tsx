import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_PRODUCTS } from '../services/storage';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag, 
  Calculator,
  Layers,
  Info,
  PackageCheck
} from 'lucide-react';

export const ProductScreen: React.FC = () => {
  const { t, setCurrentTab, lang } = useApp();
  const product = INITIAL_PRODUCTS[0];

  const [activeIngredientCategory, setActiveIngredientCategory] = useState<string>('all');
  const [selectedPackSize, setSelectedPackSize] = useState<'100g' | '25kg'>('100g');

  const filteredIngredients = activeIngredientCategory === 'all'
    ? product.ingredients
    : product.ingredients.filter(ing => ing.category === activeIngredientCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-fade-in">
      
      {/* 1. Hero Product Showcase with Real Packet Photo */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0b1d17] via-[#14342A] to-[#1c493b] text-white p-6 sm:p-10 shadow-elevated overflow-hidden border-2 border-[#F2A900]/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#F2A900]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & Spec Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F2A900] text-[#14342A] text-xs font-black uppercase tracking-wider shadow-sm">
                CHANNA PELLET™
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/20">
                2 mm Pellet • 100g & 25kg
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              CHANNA PELLET
            </h1>

            <div className="text-sm sm:text-base font-semibold text-[#F2A900] uppercase tracking-wide">
              COMPLETE NUTRITION FOR CARNIVOROUS FISH & MONSTER FISHES
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Formulated specifically for Channa (Murrel / Snakehead), Asian Seabass, and carnivorous fish. Powered by <strong>20% Fish Meal</strong>, <strong>20% Squid Meal</strong>, <strong>10% Jawla Shrimp Meal</strong>, and digestive enzymes for high protein assimilation, intense natural skin/fin coloration, and maximum immunity.
            </p>

            {/* Packaging Feature Callout Pills (Matching the actual pouch) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">⚡</span>
                <span className="font-bold text-white">HIGH PROTEIN (42%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">✨</span>
                <span className="font-bold text-white">ENHANCES COLOUR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">🛡️</span>
                <span className="font-bold text-white">BOOSTS IMMUNITY</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">🌿</span>
                <span className="font-bold text-white">EASY DIGESTION</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">🌱</span>
                <span className="font-bold text-white">NATURAL INGREDIENTS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-[#F2A900]/40 flex items-center gap-2">
                <span className="text-[#F2A900] font-black text-sm">⏱️</span>
                <span className="font-bold text-white">45-DAY FAST CYCLE</span>
              </div>
            </div>

            {/* Quick Pricing & CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setCurrentTab('orders')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F2A900] hover:bg-[#d99700] text-[#14342A] text-sm font-black shadow-lg transition transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order CHANNA PELLET</span>
              </button>

              <button
                onClick={() => setCurrentTab('calc')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition"
              >
                <Calculator className="w-4 h-4 text-[#F2A900]" />
                <span>Calculate Pond Ration</span>
              </button>
            </div>
          </div>

          {/* Right Column: Actual Real Product Photo Display (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Glowing Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F2A900] via-[#2E7D4F] to-[#00D2FF] rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-subtle" />
              
              <div className="relative bg-black rounded-3xl overflow-hidden border-2 border-[#F2A900] shadow-2xl">
                <img 
                  src="/channa_pellet.jpg" 
                  alt="CHANNA PELLET Complete Nutrition for Carnivorous Fish" 
                  className="w-full h-80 object-cover object-center transform group-hover:scale-105 transition duration-500"
                />
                
                {/* Floating Badge Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
                  <div className="font-heading font-black text-lg text-[#F2A900] tracking-wide">
                    CHANNA PELLET
                  </div>
                  <div className="text-[11px] text-white/90 font-medium">
                    2 mm Pellet • Complete Nutrition for Carnivorous Fish
                  </div>
                  <div className="text-[10px] text-emerald-300 font-bold mt-0.5">
                    Healthy Fish • Happy Life
                  </div>
                </div>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedPackSize('100g')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedPackSize === '100g'
                    ? 'bg-[#F2A900] text-[#14342A] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                100 g Retail Pack (₹120)
              </button>
              <button
                onClick={() => setSelectedPackSize('25kg')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedPackSize === '25kg'
                    ? 'bg-[#F2A900] text-[#14342A] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                25 kg Farm Moisture Bag (₹1,850)
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Four Core Benefit Pillars */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-heading font-bold text-2xl text-[#14342A]">
            {t.keyBenefits}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered for predatory feeding habits and rapid digestion in Channa, Tilapia, and Shrimp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Benefit 1: Rapid 45-day growth */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80 hover:border-[#2E7D4F] transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F2A900] flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-[#F2A900] uppercase tracking-wider">
                15 Days Saved
              </div>
              <h3 className="font-heading font-bold text-lg text-[#14342A] mt-1">
                {t.benefitGrowth}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.benefitGrowthDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E7D4F]">
              <span>Cycle: 45 Days</span>
              <span>Baseline: 60 Days</span>
            </div>
          </div>

          {/* Benefit 2: Vibrant Colour */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80 hover:border-[#2E7D4F] transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2E7D4F] flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-[#2E7D4F] uppercase tracking-wider">
                Enhances Colour
              </div>
              <h3 className="font-heading font-bold text-lg text-[#14342A] mt-1">
                {t.benefitColour}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.benefitColourDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E7D4F]">
              <span>Natural Astaxanthin</span>
              <span>4.8/5 Color Index</span>
            </div>
          </div>

          {/* Benefit 3: Survival Rate */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80 hover:border-[#2E7D4F] transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#2E7D4F] flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Low Mortality
              </div>
              <h3 className="font-heading font-bold text-lg text-[#14342A] mt-1">
                {t.benefitSurvival}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.benefitSurvivalDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E7D4F]">
              <span>Survival: &gt;92%</span>
              <span>Chitin Enriched</span>
            </div>
          </div>

          {/* Benefit 4: Disease Immunity & Easy Digestion */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-slate-200/80 hover:border-[#2E7D4F] transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F2A900] flex items-center justify-center mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-[#F2A900] uppercase tracking-wider">
                Easy Digestion
              </div>
              <h3 className="font-heading font-bold text-lg text-[#14342A] mt-1">
                {t.benefitImmunity}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {t.benefitImmunityDesc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2E7D4F]">
              <span>Multi-Enzymes</span>
              <span>Target FCR: 1.16</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Complete Functional Ingredient Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#14342A]">
              {t.ingredientBreakdown}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Natural, premium ingredients designed for maximum carnivorous growth without water fouling.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveIngredientCategory('all')}
              className={`px-3 py-1 rounded-full transition ${
                activeIngredientCategory === 'all'
                  ? 'bg-[#14342A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All (9)
            </button>
            <button
              onClick={() => setActiveIngredientCategory('marine_protein')}
              className={`px-3 py-1 rounded-full transition ${
                activeIngredientCategory === 'marine_protein'
                  ? 'bg-[#2E7D4F] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Marine (50%)
            </button>
            <button
              onClick={() => setActiveIngredientCategory('plant_protein')}
              className={`px-3 py-1 rounded-full transition ${
                activeIngredientCategory === 'plant_protein'
                  ? 'bg-[#2E7D4F] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Plant & Binders
            </button>
            <button
              onClick={() => setActiveIngredientCategory('functional_additive')}
              className={`px-3 py-1 rounded-full transition ${
                activeIngredientCategory === 'functional_additive'
                  ? 'bg-[#F2A900] text-[#14342A] font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Enzymes & Amino
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((ing, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-sand-50 border border-slate-200 hover:border-[#2E7D4F] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-[#14342A]">{ing.name}</h4>
                  {ing.percentage && (
                    <span className="px-2 py-0.5 rounded-full bg-[#F2A900] text-[#14342A] font-bold text-xs shrink-0">
                      {ing.percentage}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ing.role}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 text-[10px] text-emerald-800 font-semibold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F]" />
                <span>{ing.category.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Feeding Guide by Growth Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80">
        <div className="mb-6">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#14342A]">
            {t.feedingGuideTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Standard feeding schedule optimized for maximum carnivorous feeding without overfeeding and water pollution.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#14342A] text-white">
                <th className="py-3 px-4 rounded-l-xl font-bold">Stage & Body Weight</th>
                <th className="py-3 px-4 font-bold">Feed SKU & Type</th>
                <th className="py-3 px-4 font-bold">Daily Feeding Rate (% Biomass)</th>
                <th className="py-3 px-4 rounded-r-xl font-bold">Daily Feedings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.feedingStages.map((stage, sIdx) => (
                <tr key={sIdx} className="hover:bg-emerald-50/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-[#14342A]">
                    <div>{stage.stage}</div>
                    <span className="text-xs text-slate-500 font-normal">{stage.bodyWeightRange}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-mono text-xs font-bold text-[#2E7D4F] block">{stage.feedCode}</span>
                    <span>{stage.feedType}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {stage.feedingRatePercent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {stage.frequencyPerDay} times / day
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
