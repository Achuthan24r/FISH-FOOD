import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Batch, GrowthLog } from '../types';
import { storageService } from '../services/storage';
import { compressImage } from '../services/imageCompression';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Layers, 
  PlusCircle, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Droplets, 
  Camera, 
  CheckCircle2, 
  Clock, 
  X,
  Scale
} from 'lucide-react';

export const BatchesScreen: React.FC = () => {
  const { 
    currentUser, 
    batches, 
    refreshBatches, 
    t, 
    showToast, 
    lang 
  } = useApp();

  const userBatches = batches.filter(b => b.userId === currentUser.id);
  const ponds = storageService.getPonds(currentUser.id);

  const [selectedBatchId, setSelectedBatchId] = useState<string>(userBatches[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'charts' | 'logs'>('charts');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newPondId, setNewPondId] = useState(ponds[0]?.id || 'pond-01');
  const [newSpecies, setNewSpecies] = useState<'Vannamei Shrimp' | 'Black Tiger Shrimp' | 'GIFT Tilapia' | 'Catfish' | 'Asian Seabass'>('Vannamei Shrimp');
  const [newStockDate, setNewStockDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStockCount, setNewStockCount] = useState(60000);
  const [newFeedType, setNewFeedType] = useState<'aquavigor' | 'other'>('aquavigor');
  const [newInitialWeight, setNewInitialWeight] = useState(0.5);
  const [newTargetWeight, setNewTargetWeight] = useState(30.0);

  // Weekly Log Form State
  const [logDocDay, setLogDocDay] = useState(35);
  const [logAbw, setLogAbw] = useState(24.5);
  const [logMortality, setLogMortality] = useState(90);
  const [logFeedFed, setLogFeedFed] = useState(820);
  const [logColourScore, setLogColourScore] = useState(5);
  const [logWaterTemp, setLogWaterTemp] = useState(28.5);
  const [logDo, setLogDo] = useState(6.2);
  const [logNotes, setLogNotes] = useState('');
  const [logPhotoUrl, setLogPhotoUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const activeBatch = batches.find(b => b.id === selectedBatchId) || userBatches[0];
  const logs = activeBatch ? storageService.getGrowthLogs(activeBatch.id) : [];

  // Recharts Data Mapping: Real-time curve vs 60-day baseline curve
  const growthChartData = logs.map(l => {
    // Expected standard baseline weight at this day
    const baselineExpectedWeight = Number((0.5 + (l.dayNumber * 0.45)).toFixed(1));
    const targetAquaVigorWeight = Number((0.5 + (l.dayNumber * 0.68)).toFixed(1));
    return {
      day: `Day ${l.dayNumber}`,
      dayNum: l.dayNumber,
      actualWeight: l.averageWeightG,
      targetAquaVigor: targetAquaVigorWeight,
      baselineStandard: baselineExpectedWeight,
      mortality: l.mortalityCount,
      feedFed: l.feedFedKg,
      colourScore: l.colourScore
    };
  });

  // Calculate Days in culture
  const stockDate = activeBatch ? new Date(activeBatch.stockingDate) : new Date();
  const diffDays = Math.max(1, Math.round((new Date().getTime() - stockDate.getTime()) / (1000 * 60 * 60 * 24)));
  const targetDays = activeBatch?.feedType === 'aquavigor' ? 45 : 60;
  const progressPercent = Math.min(100, Math.round((diffDays / targetDays) * 100));

  // Anomaly Alerts detection
  const hasMortalitySpike = logs.some(l => l.mortalityCount > 300);
  const isLaggingGrowth = activeBatch && activeBatch.currentWeightG < (diffDays * 0.45);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) {
      showToast('Please enter a batch name', 'error');
      return;
    }

    const selectedPond = ponds.find(p => p.id === newPondId) || ponds[0];
    const targetDaysCount = newFeedType === 'aquavigor' ? 45 : 60;
    const targetHarvest = new Date(newStockDate);
    targetHarvest.setDate(targetHarvest.getDate() + targetDaysCount);

    const created = storageService.addBatch({
      pondId: selectedPond.id,
      userId: currentUser.id,
      pondName: selectedPond.name,
      batchName: newBatchName,
      species: newSpecies,
      stockingDate: newStockDate,
      targetHarvestDate: targetHarvest.toISOString().split('T')[0],
      stockingCount: newStockCount,
      feedType: newFeedType,
      initialWeightG: newInitialWeight,
      targetWeightG: newTargetWeight,
      status: 'active',
      currentWeightG: newInitialWeight,
      currentSurvivalRate: 100,
      currentFCR: 1.15
    });

    // Seed initial Day 0 growth log
    storageService.addGrowthLog({
      batchId: created.id,
      logDate: newStockDate,
      dayNumber: 0,
      averageWeightG: newInitialWeight,
      mortalityCount: 0,
      feedFedKg: 10,
      colourScore: 4,
      waterTempC: 28.5,
      dissolvedOxygenPpm: 6.5,
      notes: 'Initial stocking day'
    });

    refreshBatches();
    setSelectedBatchId(created.id);
    setShowCreateModal(false);
    showToast(`Batch "${created.batchName}" created successfully!`, 'success');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedBase64 = await compressImage(file, 800, 800, 0.75);
      setLogPhotoUrl(compressedBase64);
      setIsCompressing(false);
      showToast('Pond photo compressed and ready!', 'info');
    } catch (err) {
      setIsCompressing(false);
      showToast('Image processing error', 'error');
    }
  };

  const handleAddGrowthLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) return;

    storageService.addGrowthLog({
      batchId: activeBatch.id,
      logDate: new Date().toISOString().split('T')[0],
      dayNumber: logDocDay,
      averageWeightG: logAbw,
      mortalityCount: logMortality,
      feedFedKg: logFeedFed,
      colourScore: logColourScore,
      waterTempC: logWaterTemp,
      dissolvedOxygenPpm: logDo,
      notes: logNotes,
      photoUrl: logPhotoUrl || undefined
    });

    refreshBatches();
    setShowLogModal(false);
    setLogPhotoUrl(null);
    setLogNotes('');
    showToast(t.logSuccess, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A] flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#2E7D4F]" />
            <span>{t.batchTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.batchSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            id="btn-add-weekly-log"
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#14342A] border border-emerald-300 text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[#2E7D4F]" />
            <span>{t.weeklyLogTitle}</span>
          </button>

          <button
            id="btn-create-new-batch"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-[#F2A900]" />
            <span>{t.createBatch}</span>
          </button>
        </div>
      </div>

      {/* 2. Anomaly Alerts if detected */}
      {hasMortalitySpike && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 text-xs animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-800">Mortality Alert Detected</h4>
            <p className="mt-0.5">{t.alertMortality}</p>
          </div>
        </div>
      )}

      {/* 3. Batch Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {userBatches.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBatchId(b.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedBatchId === b.id
                ? 'bg-[#14342A] text-white shadow-elevated border border-[#F2A900]/40'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{b.batchName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              b.feedType === 'aquavigor' ? 'bg-[#F2A900] text-[#14342A]' : 'bg-slate-200 text-slate-800'
            }`}>
              {b.feedType === 'aquavigor' ? 'CHANNA PELLET 45d' : '60d Standard'}
            </span>
          </button>
        ))}
      </div>

      {activeBatch && (
        <>
          {/* 4. Active Batch Milestone & Health Strip */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-xl text-[#14342A]">
                    {activeBatch.batchName}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeBatch.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {activeBatch.status === 'active' ? 'Active Culture' : 'Harvest Completed'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {activeBatch.pondName} • Stocked on {activeBatch.stockingDate} with {activeBatch.stockingCount.toLocaleString()} {activeBatch.species}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-sand-50 p-2 rounded-2xl border border-slate-200 text-xs">
                <Clock className="w-4 h-4 text-[#2E7D4F]" />
                <span className="font-bold text-[#14342A]">Culture Day: DOC {diffDays}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">{targetDays} Days Target</span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Progress to Harvest</span>
                <span className="text-[#14342A]">
                  {progressPercent}% Complete ({diffDays} / {targetDays} days)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeBatch.feedType === 'aquavigor' 
                      ? 'bg-gradient-to-r from-[#2E7D4F] via-[#3ea369] to-[#F2A900]' 
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Stocking (0.5g)</span>
                <span>Day 30 (Check-in)</span>
                <span>Day {targetDays} ({activeBatch.targetWeightG}g Harvest)</span>
              </div>
            </div>

            {/* 4 Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-500">Current ABW</span>
                <div className="text-xl font-bold text-[#14342A] mt-0.5">{activeBatch.currentWeightG}g</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Target: {activeBatch.targetWeightG}g</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-500">Survival Rate</span>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">{activeBatch.currentSurvivalRate}%</div>
                <span className="text-[10px] text-slate-500">Benchmark: &gt;92%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-500">Current FCR</span>
                <div className="text-xl font-bold text-[#F2A900] mt-0.5">{activeBatch.currentFCR}</div>
                <span className="text-[10px] text-slate-500">High efficiency</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] uppercase font-bold text-slate-500">Feed Choice</span>
                <div className="text-sm font-bold text-[#2E7D4F] mt-1 capitalize">
                  {activeBatch.feedType === 'aquavigor' ? 'CHANNA PELLET™ Feed' : 'Commercial Standard'}
                </div>
                <span className="text-[10px] text-slate-500">20% Squid & Fish Meal</span>
              </div>
            </div>

          </div>

          {/* 5. Sub-Tabs: Charts vs Weekly Log History */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'charts' ? 'bg-[#14342A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Growth & FCR Charts
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'logs' ? 'bg-[#14342A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Weekly Log History ({logs.length})
            </button>
          </div>

          {activeTab === 'charts' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Growth Curve (AquaVigor 45-day curve vs 60-day baseline) */}
              <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#14342A]">
                      {t.growthCurve}
                    </h3>
                    <p className="text-xs text-slate-500">
                      CHANNA PELLET target trajectory (45 days) vs standard commercial feed baseline (60 days)
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis unit="g" tick={{ fontSize: 11 }} domain={[0, 32]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="actualWeight" 
                        name="Actual Pond ABW (g)" 
                        stroke="#2E7D4F" 
                        strokeWidth={3} 
                        dot={{ r: 5, fill: '#2E7D4F' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="targetAquaVigor" 
                        name="CHANNA PELLET 45d Target" 
                        stroke="#F2A900" 
                        strokeWidth={2} 
                        strokeDasharray="4 4" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="baselineStandard" 
                        name="Standard 60d Baseline" 
                        stroke="#94a3b8" 
                        strokeWidth={1.5} 
                        strokeDasharray="2 2" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Weekly Mortality Trend */}
              <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#14342A]">
                      {t.mortalityTrend}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mortality count logged per 7-day culture interval
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Low Mortality Regime
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Bar 
                        dataKey="mortality" 
                        name="Weekly Mortality (Count)" 
                        fill="#2E7D4F" 
                        radius={[6, 6, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Weekly Feed Intake (kg) */}
              <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#14342A]">
                      Feed Consumption Progression
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total kilograms of AquaVigor fed across sampling checks
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthChartData}>
                      <defs>
                        <linearGradient id="feedColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F2A900" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#F2A900" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis unit="kg" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="feedFed" 
                        name="Feed Consumed (kg)" 
                        stroke="#F2A900" 
                        fillOpacity={1} 
                        fill="url(#feedColor)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Body Color Score (1 to 5) */}
              <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#14342A]">
                      Pigmentation & Colour Index (1-5)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enhanced by 10% Jawla meal astaxanthin and squid sterols
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#F2A900] bg-amber-50 px-2 py-0.5 rounded-full">
                    A-Grade Export Finish
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} ticks={[1, 2, 3, 4, 5]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Line 
                        type="stepAfter" 
                        dataKey="colourScore" 
                        name="Colour Score (1-5)" 
                        stroke="#e11d48" 
                        strokeWidth={2.5} 
                        dot={{ r: 5, fill: '#e11d48' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          ) : (
            /* Weekly Log Table View */
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#14342A] text-white">
                    <th className="py-3 px-3 rounded-l-xl font-bold">DOC</th>
                    <th className="py-3 px-3 font-bold">Log Date</th>
                    <th className="py-3 px-3 font-bold">Avg Body Weight (g)</th>
                    <th className="py-3 px-3 font-bold">Mortality</th>
                    <th className="py-3 px-3 font-bold">Feed Fed (kg)</th>
                    <th className="py-3 px-3 font-bold">Colour Score</th>
                    <th className="py-3 px-3 font-bold">Temp / DO</th>
                    <th className="py-3 px-3 rounded-r-xl font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-bold text-[#14342A]">Day {log.dayNumber}</td>
                      <td className="py-3 px-3 text-slate-600">{log.logDate}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{log.averageWeightG} g</td>
                      <td className="py-3 px-3 text-slate-700">{log.mortalityCount}</td>
                      <td className="py-3 px-3 text-slate-700">{log.feedFedKg} kg</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                          {log.colourScore} / 5 ★
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{log.waterTempC}°C • {log.dissolvedOxygenPpm}ppm</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{log.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* --- CREATE NEW BATCH MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-[#14342A]">
                {t.createBatch}
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.batchName}</label>
                <input
                  type="text"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Pond 2 - Monsoon Shrimp Cycle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-[#2E7D4F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.pondLabel}</label>
                  <select
                    value={newPondId}
                    onChange={(e) => setNewPondId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {ponds.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.selectSpecies}</label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Vannamei Shrimp">Vannamei Shrimp</option>
                    <option value="Black Tiger Shrimp">Black Tiger Shrimp</option>
                    <option value="GIFT Tilapia">GIFT Tilapia</option>
                    <option value="Catfish">Catfish</option>
                    <option value="Asian Seabass">Asian Seabass</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.stockDate}</label>
                  <input
                    type="date"
                    value={newStockDate}
                    onChange={(e) => setNewStockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.stockCountLabel}</label>
                  <input
                    type="number"
                    value={newStockCount}
                    onChange={(e) => setNewStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.feedChoice}</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setNewFeedType('aquavigor')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                      newFeedType === 'aquavigor' 
                        ? 'border-[#2E7D4F] bg-emerald-50 text-[#14342A]' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">CHANNA PELLET™</div>
                    <div className="text-[10px] text-emerald-700">45-day cycle target</div>
                  </div>

                  <div
                    onClick={() => setNewFeedType('other')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                      newFeedType === 'other' 
                        ? 'border-[#2E7D4F] bg-emerald-50 text-[#14342A]' 
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-bold">Commercial Standard</div>
                    <div className="text-[10px] text-slate-500">60-day baseline</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.initialWeight}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newInitialWeight}
                    onChange={(e) => setNewInitialWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.targetWeight}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTargetWeight}
                    onChange={(e) => setNewTargetWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white font-bold shadow-md"
                >
                  {t.saveBatch}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD WEEKLY GROWTH LOG MODAL --- */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-lg text-[#14342A]">
                {t.weeklyLogTitle}
              </h3>
              <button 
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGrowthLog} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.dayNum}</label>
                  <input
                    type="number"
                    value={logDocDay}
                    onChange={(e) => setLogDocDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.currentAbw}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logAbw}
                    onChange={(e) => setLogAbw(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.weeklyMortality}</label>
                  <input
                    type="number"
                    value={logMortality}
                    onChange={(e) => setLogMortality(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.feedUsedKg}</label>
                  <input
                    type="number"
                    value={logFeedFed}
                    onChange={(e) => setLogFeedFed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              {/* Colour Score Slider 1-5 */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{t.colourScoreLabel}</span>
                  <span className="text-[#F2A900] font-bold text-sm">
                    {logColourScore} / 5 Stars ★
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={logColourScore}
                  onChange={(e) => setLogColourScore(Number(e.target.value))}
                  className="w-full accent-[#F2A900]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1: Dull / Pale</span>
                  <span>3: Normal</span>
                  <span>5: Lustrous Astaxanthin Pigment</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.waterTempLabel}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logWaterTemp}
                    onChange={(e) => setLogWaterTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.doLabel}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logDo}
                    onChange={(e) => setLogDo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Photo Upload with Compression */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.photoUpload}
                </label>
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2E7D4F] cursor-pointer bg-slate-50 transition">
                  <Camera className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-600 font-medium">
                    {isCompressing ? 'Compressing image...' : 'Take or Upload Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {logPhotoUrl && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-300">
                    <img src={logPhotoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setLogPhotoUrl(null)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.farmerNotes}</label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Feed tray observations, molting status, pond bottom condition..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white font-bold shadow-md"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
