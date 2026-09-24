import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Save,
  Sparkles,
  Droplets,
  Thermometer,
  Scale,
  IndianRupee,
  Clock,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import { storageService } from '../services/storage';

export const CalculatorScreen: React.FC = () => {
  const { t, currentUser, batches, showToast } = useApp();

  const userBatches = batches.filter(b => b.userId === currentUser.id && b.status === 'active');

  const [species, setSpecies] = useState<'Vannamei Shrimp' | 'Black Tiger Shrimp' | 'GIFT Tilapia' | 'Catfish' | 'Asian Seabass'>('Vannamei Shrimp');
  const [population, setPopulation] = useState<number>(50000);
  const [abw, setAbw] = useState<number>(14.5);
  const [waterTemp, setWaterTemp] = useState<number>(28.5);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(userBatches[0]?.id || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Feeding Rate Calculation Logic
  // Smaller body weight requires higher % body weight feeding rate
  const getFeedingRatePercent = (sp: string, weightG: number): number => {
    if (sp.includes('Shrimp')) {
      if (weightG <= 2) return 7.5;
      if (weightG <= 5) return 5.8;
      if (weightG <= 10) return 4.5;
      if (weightG <= 20) return 3.4;
      return 2.5;
    } else if (sp.includes('Tilapia')) {
      if (weightG <= 10) return 8.0;
      if (weightG <= 50) return 5.0;
      if (weightG <= 150) return 3.2;
      return 2.2;
    } else if (sp.includes('Catfish')) {
      if (weightG <= 20) return 6.0;
      if (weightG <= 100) return 3.5;
      return 2.0;
    } else {
      // Asian Seabass
      if (weightG <= 20) return 7.0;
      if (weightG <= 100) return 4.0;
      return 2.8;
    }
  };

  // Temperature multiplier (Appetite peaks between 28-30°C)
  const getTempFactor = (temp: number): number => {
    if (temp < 25) return 0.80; // cold water reduces metabolic rate
    if (temp <= 27) return 0.92;
    if (temp <= 30.5) return 1.00; // optimal
    if (temp <= 32) return 0.90;
    return 0.75; // heat stress
  };

  const feedingRate = getFeedingRatePercent(species, abw);
  const tempFactor = getTempFactor(waterTemp);
  const adjustedRate = Number((feedingRate * tempFactor).toFixed(2));

  // Daily Feed Quantity in Grams and Kg
  const dailyFeedGrams = Math.round(population * abw * (adjustedRate / 100));
  const dailyFeedKg = Number((dailyFeedGrams / 1000).toFixed(1));

  // Recommended feeds per day
  const feedsPerDay = abw < 5 ? 4 : (abw < 18 ? 4 : 3);

  // Pellet / crumb size
  const pelletSize = abw < 2
    ? '0.8mm Crumble'
    : (abw < 8 ? '1.2mm Crumble' : (abw < 18 ? '1.5mm Pellet' : '2.0mm Extruded Pellet'));

  // Pack economics: 100g pack priced at ₹130
  const packSizeG = 100;
  const pricePer100gPack = 130;
  const dailyPacksEstimate = Math.ceil(dailyFeedGrams / packSizeG);
  const dailyCostInr = Math.round(dailyPacksEstimate * pricePer100gPack);

  // 45-day cycle estimate vs 60-day baseline savings
  const est45DayFeedTotalPacks = Math.round(dailyPacksEstimate * 42);
  const baseline60DayFeedTotalPacks = Math.round(dailyPacksEstimate * 58 * 1.25);
  const estimatedFeedCostSaved = Math.round((baseline60DayFeedTotalPacks - est45DayFeedTotalPacks) * pricePer100gPack * 0.7);
  const electricityLaborSaved = 18000; // estimated 15 days aeration + labor
  const totalSavings = estimatedFeedCostSaved + electricityLaborSaved;

  const handleSaveToBatch = () => {
    if (!selectedBatchId) {
      showToast('Please select an active pond or batch to link results', 'error');
      return;
    }
    const batch = batches.find(b => b.id === selectedBatchId);
    if (!batch) return;

    // Save to growth log or batch record
    storageService.addGrowthLog({
      batchId: batch.id,
      logDate: new Date().toISOString().split('T')[0],
      dayNumber: 30,
      averageWeightG: abw,
      mortalityCount: 0,
      feedFedKg: dailyFeedKg,
      colourScore: 5,
      waterTempC: waterTemp,
      dissolvedOxygenPpm: 6.2,
      notes: `Smart Calculator Ration: ${dailyFeedKg} kg/day (${feedsPerDay} meals/day) with ${adjustedRate}% feeding rate.`
    });

    setIsSaved(true);
    showToast(`Feeding ration of ${dailyFeedKg} kg/day saved to ${batch.batchName}!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A] flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-[#2E7D4F]" />
            <span>{t.calcTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.calcSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Zap className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>FCR Optimized for CHANNA PELLET</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Interactive Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-soft border border-slate-200/80 space-y-5">
          <h2 className="font-heading font-bold text-lg text-[#14342A] flex items-center gap-2">
            <span>Pond & Crop Parameters</span>
          </h2>

          {/* 1. Species */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.selectSpecies}
            </label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D4F] focus:ring-1 focus:ring-[#2E7D4F] text-sm text-slate-900 outline-none bg-white font-medium"
            >
              <option value="Vannamei Shrimp">Vannamei Shrimp (வழக்கமான வெண்ணமீ)</option>
              <option value="Black Tiger Shrimp">Black Tiger Shrimp (கருப்பு புலி இறால்)</option>
              <option value="GIFT Tilapia">GIFT Tilapia (திலாப்பியா மீன்)</option>
              <option value="Catfish">Catfish (விரால் / கெளுத்தி மீன்)</option>
              <option value="Asian Seabass">Asian Seabass (கொடுவா மீன்)</option>
            </select>
          </div>

          {/* 2. Population */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>{t.stockCount}</span>
              <span className="font-mono text-emerald-700 text-sm">
                {population.toLocaleString()} pieces
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={5000}
              value={population}
              onChange={(e) => setPopulation(Number(e.target.value))}
              className="w-full accent-[#2E7D4F]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5,000</span>
              <span>50,000 (Standard Acre)</span>
              <span>150,000</span>
            </div>
          </div>

          {/* 3. Average Body Weight (ABW) */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#2E7D4F]" />
                <span>{t.abwLabel}</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="50"
                  value={abw}
                  onChange={(e) => setAbw(Math.max(0.5, Number(e.target.value)))}
                  className="w-16 px-2 py-0.5 text-right font-bold text-sm text-[#14342A] border border-slate-300 rounded-lg outline-none"
                />
                <span className="text-xs font-bold text-slate-500">grams</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={35}
              step={0.5}
              value={abw}
              onChange={(e) => setAbw(Number(e.target.value))}
              className="w-full accent-[#2E7D4F]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.5g (Post-larvae)</span>
              <span>15g (Grower)</span>
              <span>30g+ (Harvest)</span>
            </div>
          </div>

          {/* 4. Water Temperature */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.waterTemp}</span>
              </span>
              <span className="font-bold text-sm text-[#14342A]">
                {waterTemp}°C {waterTemp >= 28 && waterTemp <= 30.5 ? '🔥 Peak Appetite' : ''}
              </span>
            </div>
            <input
              type="range"
              min={24}
              max={34}
              step={0.5}
              value={waterTemp}
              onChange={(e) => setWaterTemp(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>24°C (Cold)</span>
              <span>28.5°C (Ideal)</span>
              <span>34°C (Stress)</span>
            </div>
          </div>

          {/* Link to Batch */}
          {userBatches.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link to Active Pond Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 outline-none"
              >
                {userBatches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} ({b.pondName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Save Button */}
          <button
            id="btn-save-calculator-record"
            onClick={handleSaveToBatch}
            className="w-full py-3 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? "Saved to Pond Log!" : t.saveToBatch}</span>
          </button>
        </div>

        {/* Right Column: Dynamic Prescribed Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">

          {/* Main Prescription Card */}
          <div className="bg-gradient-to-br from-[#14342A] to-[#1c493b] text-white p-6 rounded-3xl shadow-elevated border border-[#F2A900]/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F2A900]" />
                <h3 className="font-heading font-bold text-lg text-white">
                  {t.calcResults}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F2A900] text-[#14342A] font-bold">
                {adjustedRate}% Biomass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">

              {/* Output 1: Daily Feed Qty in Packs & Kg */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="text-[11px] text-emerald-200 block uppercase font-bold">
                  {t.dailyFeedQty}
                </span>
                <div className="mt-1">
                  <span className="text-3xl font-heading font-bold text-[#F2A900]">
                    {dailyPacksEstimate.toLocaleString()}
                  </span>
                  <span className="text-sm ml-1 text-slate-200 font-semibold">packs / day</span>
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  ≈ {dailyFeedKg} kg ({dailyFeedGrams.toLocaleString()} g in 100g packs)
                </span>
              </div>

              {/* Output 2: Feeding Frequency */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="text-[11px] text-emerald-200 block uppercase font-bold">
                  {t.feedsPerDay}
                </span>
                <div className="mt-1">
                  <span className="text-3xl font-heading font-bold text-white">
                    {feedsPerDay}
                  </span>
                  <span className="text-sm ml-1 text-slate-200 font-semibold">times / day</span>
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  ≈ {Math.ceil(dailyPacksEstimate / feedsPerDay)} packs ({(dailyFeedKg / feedsPerDay).toFixed(1)} kg) / feed
                </span>
              </div>

              {/* Output 3: Estimated Daily Cost */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <span className="text-[11px] text-emerald-200 block uppercase font-bold">
                  {t.dailyCost}
                </span>
                <div className="mt-1">
                  <span className="text-3xl font-heading font-bold text-white">
                    ₹{dailyCostInr.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 block mt-1">
                  @ ₹130 per 100g pack
                </span>
              </div>

            </div>

            {/* Pellet Size & Feed Schedule Advice */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-emerald-300 font-bold block">{t.pelletSize}:</span>
                <span className="text-white font-medium">{pelletSize}</span>
              </div>
              <div>
                <span className="text-emerald-300 font-bold block">{t.fcrEstimate}:</span>
                <span className="text-[#F2A900] font-bold">1.15 – 1.20</span>
              </div>
              <div>
                <span className="text-emerald-300 font-bold block">Water Stability:</span>
                <span className="text-white font-medium">&gt; 3.5 Hours</span>
              </div>
            </div>
          </div>

          {/* 45-Day Cycle Economic Impact & Savings Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2E7D4F]" />
              <h3 className="font-heading font-bold text-base text-[#14342A]">
                The CHANNA PELLET 45-Day Culture Advantage
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Standard commercial feeds require an average of <strong>60 days</strong> to bring fish to market weight. With CHANNA PELLET’s 20% squid meal, 10% jawla meal, and multi-enzyme complex, farmers consistently harvest in <strong>45 days</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Time Saved</span>
                <div className="text-lg font-bold text-[#2E7D4F]">15 Full Days</div>
                <span className="text-[10px] text-slate-500">Less disease exposure risk</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Feed Cost Savings</span>
                <div className="text-lg font-bold text-[#2E7D4F]">₹{estimatedFeedCostSaved.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">From superior 1.16 FCR</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-300 bg-amber-50/50">
                <span className="text-[10px] text-amber-900 font-bold uppercase">Total Farm Profit Boost</span>
                <div className="text-lg font-bold text-[#14342A]">₹{totalSavings.toLocaleString()}</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Feed + Power + Labor</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
