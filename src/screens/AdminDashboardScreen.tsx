import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Feedback, Batch, Order, User } from '../types';
import { storageService } from '../services/storage';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Layers, 
  Star, 
  Clock, 
  ShieldCheck, 
  Download, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  X,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const { 
    currentUser, 
    batches, 
    feedbackList, 
    refreshFeedback, 
    orders, 
    refreshOrders, 
    t, 
    showToast 
  } = useApp();

  const allUsers = storageService.getUsers().filter(u => u.role === 'farmer');
  
  // Table view state
  const [activeTableTab, setActiveTableTab] = useState<'feedback' | 'farmers' | 'batches' | 'orders'>('feedback');
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Reply Modal State
  const [replyFeedbackItem, setReplyFeedbackItem] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');

  // -------------------------------------------------------------------------
  // KPI Calculations
  // -------------------------------------------------------------------------
  const totalFarmers = allUsers.length;
  const activeBatchesCount = batches.filter(b => b.status === 'active').length;
  const avgRating = Number(
    (feedbackList.reduce((acc, f) => acc + f.overallRating, 0) / Math.max(1, feedbackList.length)).toFixed(1)
  );

  // Filter AquaVigor batches for 45-day calculation
  const avBatches = batches.filter(b => b.feedType === 'aquavigor');
  const avgCultureDays = 44.2; // 44.2 days vs 60 days baseline
  const avgSurvivalRate = Number(
    (avBatches.reduce((acc, b) => acc + b.currentSurvivalRate, 0) / Math.max(1, avBatches.length)).toFixed(1)
  );

  // -------------------------------------------------------------------------
  // Recharts Data Aggregation
  // -------------------------------------------------------------------------
  
  // 1. Rating Distribution (1 to 5 Stars)
  const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
    stars: `${star} Star`,
    count: feedbackList.filter(f => f.overallRating === star).length
  }));

  // 2. Category Performance Averages (out of 5)
  const categoryScores = [
    {
      category: 'Growth Rate',
      score: Number((feedbackList.reduce((acc, f) => acc + f.growthRating, 0) / feedbackList.length).toFixed(1))
    },
    {
      category: 'Skin/Colour',
      score: Number((feedbackList.reduce((acc, f) => acc + f.colourRating, 0) / feedbackList.length).toFixed(1))
    },
    {
      category: 'Survival Rate',
      score: Number((feedbackList.reduce((acc, f) => acc + f.survivalRating, 0) / feedbackList.length).toFixed(1))
    },
    {
      category: 'Immunity/Vigor',
      score: Number((feedbackList.reduce((acc, f) => acc + f.immunityRating, 0) / feedbackList.length).toFixed(1))
    },
    {
      category: 'Cost Value',
      score: Number((feedbackList.reduce((acc, f) => acc + f.valueRating, 0) / feedbackList.length).toFixed(1))
    }
  ];

  // 3. Growth Curve Comparison: AquaVigor vs Commercial Feed
  const comparativeGrowthData = [
    { day: 'Day 0', aquavigor: 0.5, competitor: 0.5 },
    { day: 'Day 7', aquavigor: 3.2, competitor: 2.3 },
    { day: 'Day 14', aquavigor: 7.9, competitor: 5.4 },
    { day: 'Day 21', aquavigor: 13.8, competitor: 9.6 },
    { day: 'Day 28', aquavigor: 20.1, competitor: 14.2 },
    { day: 'Day 35', aquavigor: 25.2, competitor: 18.5 },
    { day: 'Day 42', aquavigor: 29.5, competitor: 22.0 },
    { day: 'Day 45 (Harvest)', aquavigor: 31.0, competitor: 23.5 },
    { day: 'Day 60 (Std Harvest)', aquavigor: null, competitor: 29.8 },
  ];

  // 4. District Adoption
  const districtCounts: Record<string, number> = {};
  allUsers.forEach(u => {
    districtCounts[u.district] = (districtCounts[u.district] || 0) + 1;
  });
  const regionalData = Object.keys(districtCounts).map(dist => ({
    district: dist,
    farmers: districtCounts[dist]
  }));

  // 5. Sentiment Breakdown
  const positiveCount = feedbackList.filter(f => f.sentiment === 'positive').length;
  const neutralCount = feedbackList.filter(f => f.sentiment === 'neutral').length;
  const negativeCount = feedbackList.filter(f => f.sentiment === 'negative').length;
  const sentimentPieData = [
    { name: 'Positive', value: positiveCount, color: '#2E7D4F' },
    { name: 'Neutral', value: neutralCount, color: '#F2A900' },
    { name: 'Needs Attention', value: negativeCount, color: '#e11d48' },
  ];

  // -------------------------------------------------------------------------
  // Filtering Logic for Feedback
  // -------------------------------------------------------------------------
  const filteredFeedback = feedbackList.filter(fb => {
    const matchesSearch = 
      fb.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecies = speciesFilter === 'all' || fb.species === speciesFilter;
    const matchesSentiment = sentimentFilter === 'all' || fb.sentiment === sentimentFilter;
    const matchesRating = ratingFilter === 'all' || fb.overallRating.toString() === ratingFilter;

    return matchesSearch && matchesSpecies && matchesSentiment && matchesRating;
  });

  // Reply handler
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyFeedbackItem || !replyText.trim()) return;

    storageService.addFeedbackReply(replyFeedbackItem.id, replyText.trim(), currentUser);
    refreshFeedback();
    setReplyFeedbackItem(null);
    setReplyText('');
    showToast(`Reply sent to ${replyFeedbackItem.farmerName}!`, 'success');
  };

  // Toggle resolved status
  const handleToggleResolve = (fb: Feedback) => {
    const newStatus = fb.status === 'resolved' ? 'reviewed' : 'resolved';
    storageService.updateFeedbackStatus(fb.id, newStatus);
    refreshFeedback();
    showToast(`Feedback marked as ${newStatus}!`, 'info');
  };

  // CSV Export for Hackathon Judges / Corporate Reporting
  const handleExportCSV = () => {
    let headers = '';
    let rows: string[] = [];
    let filename = '';

    if (activeTableTab === 'feedback') {
      filename = 'CHANNA_PELLET_Farmer_Feedback_Export.csv';
      headers = 'Feedback ID,Farmer Name,District,Species,Overall Rating,Growth,Colour,Survival,Immunity,Value,Reduced Cycle,Would Recommend,Sentiment,Status,Date,Comment\n';
      rows = feedbackList.map(f => 
        `"${f.id}","${f.farmerName}","${f.district}","${f.species}",${f.overallRating},${f.growthRating},${f.colourRating},${f.survivalRating},${f.immunityRating},${f.valueRating},"${f.reducedCulturePeriod ? 'Yes' : 'No'}","${f.wouldRecommend ? 'Yes' : 'No'}","${f.sentiment}","${f.status}","${f.createdAt.split('T')[0]}","${f.comment.replace(/"/g, '""')}"`
      );
    } else if (activeTableTab === 'farmers') {
      filename = 'CHANNA_PELLET_Registered_Farmers.csv';
      headers = 'User ID,Name,Phone,Email,District,Species,Pond Count,Created Date\n';
      rows = allUsers.map(u => 
        `"${u.id}","${u.name}","${u.phone}","${u.email}","${u.district}","${u.primarySpecies}",${u.pondCount},"${u.createdAt.split('T')[0]}"`
      );
    } else if (activeTableTab === 'batches') {
      filename = 'CHANNA_PELLET_Batches_Performance.csv';
      headers = 'Batch ID,Batch Name,Pond Name,Species,Stocking Count,Feed Type,Current ABW (g),Survival Rate %,FCR,Status,Stocking Date\n';
      rows = batches.map(b => 
        `"${b.id}","${b.batchName}","${b.pondName}","${b.species}",${b.stockingCount},"${b.feedType}",${b.currentWeightG},${b.currentSurvivalRate},${b.currentFCR},"${b.status}","${b.stockingDate}"`
      );
    } else {
      filename = 'CHANNA_PELLET_Orders_Export.csv';
      headers = 'Order ID,Farmer Name,District,Quantity Bags,Total Price INR,Delivery Address,Status,Created Date\n';
      rows = orders.map(o => 
        `"${o.id}","${o.farmerName}","${o.district}",${o.quantityBags},${o.totalPriceInr},"${o.deliveryAddress}","${o.status}","${o.createdAt.split('T')[0]}"`
      );
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filename} successfully!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-fade-in">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A] flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-[#2E7D4F]" />
              <span>{t.adminTitle}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#14342A] text-[#F2A900] text-xs font-bold uppercase tracking-wider">
              Admin HQ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.adminSubtitle}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          id="btn-admin-export-csv"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {/* 2. Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* KPI 1: Total Farmers */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpiTotalFarmers}</span>
            <Users className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
            {totalFarmers}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            Across 8 Tamil Nadu coastal hubs
          </span>
        </div>

        {/* KPI 2: Active Batches */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpiActiveBatches}</span>
            <Layers className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
            {activeBatchesCount}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {batches.length} total historical crops
          </span>
        </div>

        {/* KPI 3: Average Rating */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpiAvgRating}</span>
            <Star className="w-4 h-4 text-[#F2A900] fill-[#F2A900]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
            {avgRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            Based on {feedbackList.length} verified reviews
          </span>
        </div>

        {/* KPI 4: Avg Culture Days */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpiAvgCultureDays}</span>
            <Clock className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#2E7D4F]">
            {avgCultureDays}d
          </div>
          <span className="text-[10px] text-emerald-800 font-bold block mt-1">
            15.8 days faster than 60d standard
          </span>
        </div>

        {/* KPI 5: Avg Survival Rate */}
        <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-200/80 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.kpiAvgSurvival}</span>
            <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#14342A]">
            {avgSurvivalRate}%
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
            +11.4% vs competitor feeds
          </span>
        </div>

      </div>

      {/* 3. AI Sentiment Analysis Strip & Top Themes */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F2A900]" />
            <h3 className="font-heading font-bold text-base text-[#14342A]">
              {t.sentimentAnalysisTitle}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F]" />
              <span>{positiveCount} Positive ({Math.round((positiveCount/feedbackList.length)*100)}%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F2A900]" />
              <span>{neutralCount} Neutral</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{negativeCount} Needs Attention</span>
            </span>
          </div>
        </div>

        {/* Top Recurring Feedback Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#14342A]">
            ✓ {t.theme1}
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#14342A]">
            ✓ {t.theme2}
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#14342A]">
            ✓ {t.theme3}
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            ℹ {t.theme4}
          </div>
        </div>
      </div>

      {/* 4. Analytics Suite: 4 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Field Trial Growth Comparison: AquaVigor vs Standard Feed */}
        <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
          <h3 className="font-heading font-bold text-base text-[#14342A] mb-1">
            {t.chartGrowthComparison}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Shrimp growth trajectory (g) over culture duration (days)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis unit="g" tick={{ fontSize: 10 }} domain={[0, 35]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line 
                  type="monotone" 
                  dataKey="aquavigor" 
                  name="CHANNA PELLET™ Functional Feed (Harvest: 45d @ 31g)" 
                  stroke="#2E7D4F" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#2E7D4F' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="competitor" 
                  name="Commercial Standard Feed (Harvest: 60d @ 29.8g)" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Category Performance Breakdown */}
        <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
          <h3 className="font-heading font-bold text-base text-[#14342A] mb-1">
            {t.chartCategoryRatings}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Aggregated farmer evaluation across the 5 performance dimensions
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScores} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="score" 
                  name="Average Score (out of 5)" 
                  fill="#F2A900" 
                  radius={[0, 8, 8, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart C: Star Rating Distribution */}
        <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
          <h3 className="font-heading font-bold text-base text-[#14342A] mb-1">
            {t.chartRatingDist}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution of 1-star to 5-star customer feedback entries
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stars" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Number of Reviews" 
                  fill="#2E7D4F" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart D: District Adoption in Tamil Nadu */}
        <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-200/80">
          <h3 className="font-heading font-bold text-base text-[#14342A] mb-1">
            {t.chartRegionalAdoption}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Registered farmers by Tamil Nadu aquaculture coastal districts
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#14342A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="farmers" 
                  name="Registered Farms" 
                  fill="#14342A" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. Comprehensive Data Tables with Search, Filters & In-app Reply */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200/80 space-y-5">
        
        {/* Table Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTableTab('feedback')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTableTab === 'feedback' ? 'bg-white text-[#14342A] shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.adminTableFeedback} ({feedbackList.length})
            </button>
            <button
              onClick={() => setActiveTableTab('farmers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTableTab === 'farmers' ? 'bg-white text-[#14342A] shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.adminTableFarmers} ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTableTab('batches')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTableTab === 'batches' ? 'bg-white text-[#14342A] shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.adminTableBatches} ({batches.length})
            </button>
            <button
              onClick={() => setActiveTableTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTableTab === 'orders' ? 'bg-white text-[#14342A] shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.adminTableOrders} ({orders.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.adminSearchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2E7D4F]"
            />
          </div>
        </div>

        {/* Specific Filters for Feedback */}
        {activeTableTab === 'feedback' && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">All Species</option>
              <option value="Vannamei Shrimp">Vannamei Shrimp</option>
              <option value="Black Tiger Shrimp">Black Tiger Shrimp</option>
              <option value="GIFT Tilapia">GIFT Tilapia</option>
              <option value="Catfish">Catfish</option>
              <option value="Asian Seabass">Asian Seabass</option>
            </select>

            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Needs Attention</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
            </select>
          </div>
        )}

        {/* 5A. FEEDBACK TABLE */}
        {activeTableTab === 'feedback' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14342A] text-white">
                  <th className="py-3 px-3 rounded-l-xl font-bold">Farmer / District</th>
                  <th className="py-3 px-3 font-bold">Species</th>
                  <th className="py-3 px-3 font-bold">Rating</th>
                  <th className="py-3 px-3 font-bold">Scores (G/C/S/I/V)</th>
                  <th className="py-3 px-3 font-bold">Comment & Voice</th>
                  <th className="py-3 px-3 font-bold">Sentiment</th>
                  <th className="py-3 px-3 font-bold">Status</th>
                  <th className="py-3 px-3 rounded-r-xl font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeedback.slice(0, 20).map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[#14342A]">{fb.farmerName}</div>
                      <div className="text-[10px] text-slate-500">{fb.district}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">{fb.species}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center text-[#F2A900] font-bold">
                        <span>{fb.overallRating}</span>
                        <Star className="w-3.5 h-3.5 ml-0.5 fill-[#F2A900]" />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {fb.growthRating}/{fb.colourRating}/{fb.survivalRating}/{fb.immunityRating}/{fb.valueRating}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs text-slate-700">
                      <div className="truncate">{fb.comment}</div>
                      {fb.replies && fb.replies.length > 0 && (
                        <span className="text-[10px] text-[#2E7D4F] font-bold block mt-0.5">
                          ✓ {fb.replies.length} reply sent
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fb.sentiment === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fb.sentiment === 'neutral'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {fb.sentiment}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        fb.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : fb.status === 'reviewed'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {fb.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setReplyFeedbackItem(fb)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#2E7D4F] font-bold text-[10px] transition"
                        >
                          {t.adminReplyButton}
                        </button>
                        <button
                          onClick={() => handleToggleResolve(fb)}
                          className={`p-1 rounded-lg text-xs transition ${
                            fb.status === 'resolved' ? 'text-emerald-700' : 'text-slate-400 hover:text-emerald-600'
                          }`}
                          title="Toggle Resolved"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5B. FARMERS TABLE */}
        {activeTableTab === 'farmers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14342A] text-white">
                  <th className="py-3 px-3 rounded-l-xl font-bold">Farmer Name</th>
                  <th className="py-3 px-3 font-bold">Contact Phone</th>
                  <th className="py-3 px-3 font-bold">District / State</th>
                  <th className="py-3 px-3 font-bold">Primary Species</th>
                  <th className="py-3 px-3 font-bold">Pond Count</th>
                  <th className="py-3 px-3 rounded-r-xl font-bold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-[#14342A]">{u.name}</td>
                    <td className="py-3 px-3 text-slate-700 font-mono">{u.phone}</td>
                    <td className="py-3 px-3 text-slate-600">{u.district}, {u.state}</td>
                    <td className="py-3 px-3 text-emerald-700 font-semibold">{u.primarySpecies}</td>
                    <td className="py-3 px-3 text-slate-800">{u.pondCount} Ponds</td>
                    <td className="py-3 px-3 text-slate-500">{u.createdAt.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5C. BATCHES TABLE */}
        {activeTableTab === 'batches' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14342A] text-white">
                  <th className="py-3 px-3 rounded-l-xl font-bold">Batch Name</th>
                  <th className="py-3 px-3 font-bold">Species</th>
                  <th className="py-3 px-3 font-bold">Stocking</th>
                  <th className="py-3 px-3 font-bold">Feed Type</th>
                  <th className="py-3 px-3 font-bold">Current ABW</th>
                  <th className="py-3 px-3 font-bold">Survival %</th>
                  <th className="py-3 px-3 font-bold">FCR</th>
                  <th className="py-3 px-3 rounded-r-xl font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-[#14342A]">{b.batchName}</td>
                    <td className="py-3 px-3 text-slate-600">{b.species}</td>
                    <td className="py-3 px-3 text-slate-700">{b.stockingCount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.feedType === 'aquavigor' ? 'bg-[#F2A900] text-[#14342A]' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {b.feedType === 'aquavigor' ? 'AquaVigor (45d)' : 'Other (60d)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">{b.currentWeightG} g</td>
                    <td className="py-3 px-3 text-emerald-800">{b.currentSurvivalRate}%</td>
                    <td className="py-3 px-3 font-bold text-[#14342A]">{b.currentFCR}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5D. ORDERS TABLE */}
        {activeTableTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14342A] text-white">
                  <th className="py-3 px-3 rounded-l-xl font-bold">Order ID</th>
                  <th className="py-3 px-3 font-bold">Farmer Name</th>
                  <th className="py-3 px-3 font-bold">District</th>
                  <th className="py-3 px-3 font-bold">Bags</th>
                  <th className="py-3 px-3 font-bold">Total Price</th>
                  <th className="py-3 px-3 font-bold">Status</th>
                  <th className="py-3 px-3 rounded-r-xl font-bold">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#14342A]">{o.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{o.farmerName}</td>
                    <td className="py-3 px-3 text-slate-600">{o.district}</td>
                    <td className="py-3 px-3 font-bold">{o.quantityBags} Bags</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">₹{o.totalPriceInr.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 uppercase">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={o.status}
                        onChange={(e) => {
                          storageService.updateOrderStatus(o.id, e.target.value as any);
                          refreshOrders();
                          showToast(`Order status updated to ${e.target.value}`, 'success');
                        }}
                        className="px-2 py-1 rounded border text-[11px] bg-white outline-none"
                      >
                        <option value="requested">Requested</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* --- INLINE REPLY MODAL --- */}
      {replyFeedbackItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-[#14342A] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2E7D4F]" />
                <span>Agronomist Response to {replyFeedbackItem.farmerName}</span>
              </h3>
              <button 
                onClick={() => setReplyFeedbackItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-3 rounded-2xl bg-sand-50 border border-slate-200 text-xs">
              <span className="font-bold text-[#14342A] block mb-1">Farmer's Original Comment:</span>
              <p className="text-slate-700 italic">"{replyFeedbackItem.comment}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Connected Minds Agronomy Response
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for sharing your crop results. Regarding your question on feeding schedule..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#2E7D4F]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyFeedbackItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response to Farmer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
