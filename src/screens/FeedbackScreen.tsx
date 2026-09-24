import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Feedback } from '../types';
import { storageService } from '../services/storage';
import { speechService } from '../services/speech';
import { compressImage } from '../services/imageCompression';
import confetti from 'canvas-confetti';
import { 
  MessageSquare, 
  Star, 
  Mic, 
  MicOff, 
  Camera, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  ThumbsUp, 
  Clock, 
  X,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const FeedbackScreen: React.FC = () => {
  const { 
    currentUser, 
    batches, 
    feedbackList, 
    refreshFeedback, 
    t, 
    lang, 
    showToast,
    feedbackPromptType 
  } = useApp();

  const userBatches = batches.filter(b => b.userId === currentUser.id);

  // Form State
  const [selectedBatchId, setSelectedBatchId] = useState<string>(userBatches[0]?.id || '');
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // Category Ratings (1-5)
  const [growthRating, setGrowthRating] = useState<number>(5);
  const [colourRating, setColourRating] = useState<number>(5);
  const [survivalRating, setSurvivalRating] = useState<number>(5);
  const [immunityRating, setImmunityRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);

  // Text & Voice
  const [comment, setComment] = useState<string>('');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  // Photo
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Binary Impact Questions
  const [reducedCulturePeriod, setReducedCulturePeriod] = useState<boolean>(true);
  const [wouldRecommend, setWouldRecommend] = useState<boolean>(true);

  // View state: 'form' vs 'history'
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  useEffect(() => {
    setSpeechSupported(speechService.isSupported());
  }, []);

  // Pre-fill speech if prompt triggered
  useEffect(() => {
    if (feedbackPromptType === 'day30') {
      const pond2 = userBatches.find(b => b.batchName.includes('Pond 2'));
      if (pond2) setSelectedBatchId(pond2.id);
    }
  }, [feedbackPromptType, userBatches]);

  // Handle Voice-to-Text
  const toggleVoiceListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      showToast('Voice recording stopped.', 'info');
    } else {
      setIsListening(true);
      showToast(lang === 'ta' ? 'பேசுங்கள்... உங்கள் குரல் எழுத்தாகிறது' : 'Speak now in English or Tamil...', 'info');
      
      speechService.startListening(
        lang,
        (transcript) => {
          setVoiceTranscript(transcript);
          setComment((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (error) => {
          setIsListening(false);
          showToast(`Speech error: ${error}. You can also type directly.`, 'error');
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 800, 800, 0.75);
      setPhotoUrl(compressed);
      setIsCompressing(false);
      showToast('Photo compressed and attached!', 'info');
    } catch (err) {
      setIsCompressing(false);
      showToast('Photo upload failed.', 'error');
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && !voiceTranscript) {
      showToast('Please provide a brief comment or voice recording', 'error');
      return;
    }

    const linkedBatch = batches.find(b => b.id === selectedBatchId) || userBatches[0];

    const newFb = storageService.addFeedback({
      batchId: linkedBatch ? linkedBatch.id : 'general',
      batchName: linkedBatch ? linkedBatch.batchName : 'General Feedback',
      userId: currentUser.id,
      farmerName: currentUser.name,
      district: currentUser.district,
      species: linkedBatch ? linkedBatch.species : currentUser.primarySpecies,
      overallRating,
      growthRating,
      colourRating,
      survivalRating,
      immunityRating,
      valueRating,
      comment: comment.trim(),
      voiceTranscript: voiceTranscript || undefined,
      photoUrl: photoUrl || undefined,
      reducedCulturePeriod,
      wouldRecommend,
      sentiment: overallRating >= 4 ? 'positive' : (overallRating === 3 ? 'neutral' : 'negative')
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if unavailable
    }

    refreshFeedback();
    showToast(t.feedbackSuccess, 'success');
    setActiveTab('history');

    // Reset Form
    setComment('');
    setVoiceTranscript('');
    setPhotoUrl(null);
  };

  // Farmer's own feedback list
  const myFeedback = feedbackList.filter(f => f.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A] flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-[#F2A900]" />
              <span>{t.feedbackTitle}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F2A900] text-[#14342A] text-xs font-bold uppercase tracking-wider">
              Key Feature
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.feedbackSubtitle}
          </p>
        </div>

        {/* Tab Toggle: Give Feedback vs My Reviews */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'submit' ? 'bg-[#14342A] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Submit Review
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'history' ? 'bg-[#14342A] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            My Past Reviews ({myFeedback.length})
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        /* --- FEEDBACK SUBMISSION FORM --- */
        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          
          {/* Section A: Overall Star Satisfaction */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Overall Experience
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#14342A]">
              {t.overallRatingLabel}
            </h2>

            {/* Interactive Large Star Touch Targets */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOverallRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-transform transform active:scale-90 hover:scale-110 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${
                      star <= (hoverRating || overallRating)
                        ? 'text-[#F2A900] fill-[#F2A900] filter drop-shadow-[0_2px_8px_rgba(242,169,0,0.35)]'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-[#14342A]">
              {overallRating === 5 && '🌟 Outstanding Growth, Colour & Survival! Highly satisfied.'}
              {overallRating === 4 && '👍 Great feed performance, very happy with results.'}
              {overallRating === 3 && '⚖️ Moderate performance, met expectations.'}
              {overallRating <= 2 && '⚠️ Needs agronomy team assistance.'}
            </p>

            {/* Automatically Linked Batch */}
            {userBatches.length > 0 && (
              <div className="max-w-md mx-auto pt-2">
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Linked Harvest / Pond Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white font-medium text-center"
                >
                  {userBatches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batchName} ({b.pondName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section B: 5 Category Performance Ratings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-5">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#14342A]">
                {t.categoryRatings}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate specific functional advantages of the CHANNA PELLET formulation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
              
              {/* Category 1: Growth */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#14342A] font-bold">{t.growthRating}</span>
                  <span className="text-[#2E7D4F] font-bold text-sm">{growthRating} / 5 ★</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={growthRating}
                  onChange={(e) => setGrowthRating(Number(e.target.value))}
                  className="w-full accent-[#2E7D4F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Slow</span>
                  <span>Target 45 Days</span>
                </div>
              </div>

              {/* Category 2: Colour */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#14342A] font-bold">{t.colourRating}</span>
                  <span className="text-[#F2A900] font-bold text-sm">{colourRating} / 5 ★</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={colourRating}
                  onChange={(e) => setColourRating(Number(e.target.value))}
                  className="w-full accent-[#F2A900]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Pale</span>
                  <span>Lustrous Astaxanthin</span>
                </div>
              </div>

              {/* Category 3: Survival */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#14342A] font-bold">{t.survivalRating}</span>
                  <span className="text-[#2E7D4F] font-bold text-sm">{survivalRating} / 5 ★</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={survivalRating}
                  onChange={(e) => setSurvivalRating(Number(e.target.value))}
                  className="w-full accent-[#2E7D4F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>&lt;80%</span>
                  <span>&gt;92% (Top Tier)</span>
                </div>
              </div>

              {/* Category 4: Immunity */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#14342A] font-bold">{t.immunityRating}</span>
                  <span className="text-[#2E7D4F] font-bold text-sm">{immunityRating} / 5 ★</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={immunityRating}
                  onChange={(e) => setImmunityRating(Number(e.target.value))}
                  className="w-full accent-[#2E7D4F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Sensitive</span>
                  <span>High Vigor & Resistance</span>
                </div>
              </div>

              {/* Category 5: Value for money */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-slate-200 md:col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#14342A] font-bold">{t.valueRating}</span>
                  <span className="text-[#2E7D4F] font-bold text-sm">{valueRating} / 5 ★</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={valueRating}
                  onChange={(e) => setValueRating(Number(e.target.value))}
                  className="w-full accent-[#2E7D4F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Standard</span>
                  <span>15 Days Shorter Cycle Saved Huge Cost</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section C: Comments + Voice-to-Text Input */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#14342A]">
                  {t.writtenComment}
                </h3>
                <p className="text-xs text-slate-500">
                  Type your comments or tap the microphone to speak in Tamil or English!
                </p>
              </div>

              {/* Voice-to-Text Button */}
              {speechSupported && (
                <button
                  type="button"
                  id="btn-voice-input"
                  onClick={toggleVoiceListening}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition transform active:scale-95 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#2E7D4F] to-[#14342A] text-white hover:from-[#3ea369]'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#F2A900]" />}
                  <span>{isListening ? t.voiceStop : t.voiceInput}</span>
                </button>
              )}
            </div>

            {/* Listening indicator */}
            {isListening && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="font-bold">{t.voiceListening}</span>
              </div>
            )}

            <textarea
              id="feedback-comment-textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={lang === 'ta' ? "இங்கே உங்கள் கருத்துக்களை உள்ளிடவும் அல்லது மைக் பட்டனை அழுத்தி பேசவும்..." : "Share how the feed worked on your shrimp/fish, color at harvest, or questions for our agronomists..."}
              className="w-full p-4 rounded-2xl border border-slate-300 focus:border-[#2E7D4F] focus:ring-1 focus:ring-[#2E7D4F] text-sm text-slate-800 outline-none"
              required
            />

            {/* Photo Attachment & Impact Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.photoUpload}
                </label>
                <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#2E7D4F] cursor-pointer bg-slate-50 transition">
                  <Camera className="w-5 h-5 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">
                    {isCompressing ? 'Compressing...' : 'Attach Fish / Harvest Picture'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={photoUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-emerald-300" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Two Binary Impact Questions */}
              <div className="space-y-3">
                
                {/* Question 1: Did culture period reduce? */}
                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200">
                  <div className="text-xs font-bold text-[#14342A] mb-1.5">
                    {t.cultureReducedQ}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReducedCulturePeriod(true)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                        reducedCulturePeriod ? 'bg-[#2E7D4F] text-white shadow-sm' : 'bg-white border text-slate-600'
                      }`}
                    >
                      ✓ {t.yes} (~45 Days)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReducedCulturePeriod(false)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                        !reducedCulturePeriod ? 'bg-slate-700 text-white shadow-sm' : 'bg-white border text-slate-600'
                      }`}
                    >
                      ✕ {t.no} (60+ Days)
                    </button>
                  </div>
                </div>

                {/* Question 2: Would you recommend it? */}
                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200">
                  <div className="text-xs font-bold text-[#14342A] mb-1.5">
                    {t.recommendQ}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                        wouldRecommend ? 'bg-[#2E7D4F] text-white shadow-sm' : 'bg-white border text-slate-600'
                      }`}
                    >
                      ✓ {t.yes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                        !wouldRecommend ? 'bg-slate-700 text-white shadow-sm' : 'bg-white border text-slate-600'
                      }`}
                    >
                      ✕ {t.no}
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                id="submit-feedback-button"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#2E7D4F] to-[#14342A] hover:from-[#3ea369] text-white font-bold text-sm shadow-elevated transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Send className="w-5 h-5 text-[#F2A900]" />
                <span>{t.submitFeedback}</span>
              </button>
            </div>

          </div>

        </form>
      ) : (
        /* --- MY PAST FEEDBACK & COMPANY REPLIES --- */
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#14342A]">
            {t.myPastFeedback}
          </h2>

          {myFeedback.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center shadow-soft border border-slate-200">
              <p className="text-sm text-slate-500">You haven't submitted any reviews yet.</p>
              <button
                onClick={() => setActiveTab('submit')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#2E7D4F] text-white text-xs font-bold"
              >
                Submit First Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myFeedback.map((fb) => (
                <div key={fb.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
                  
                  {/* Top Bar: Batch, Stars, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#14342A]">{fb.batchName}</span>
                        <span className="text-xs text-slate-500">• {fb.species}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= fb.overallRating
                                ? 'text-[#F2A900] fill-[#F2A900]'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-[#14342A] ml-1">
                          {fb.overallRating}.0 / 5.0
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        fb.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : fb.status === 'reviewed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {fb.status === 'resolved' ? t.statusResolved : (fb.status === 'reviewed' ? t.statusReviewed : t.statusNew)}
                      </span>
                      <span className="text-xs text-slate-400">{fb.createdAt.split('T')[0]}</span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {fb.comment}
                  </p>

                  {/* Category Ratings Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] bg-sand-50 p-2.5 rounded-2xl border border-slate-100">
                    <div>Growth: <strong className="text-emerald-700">{fb.growthRating}★</strong></div>
                    <div>Colour: <strong className="text-amber-700">{fb.colourRating}★</strong></div>
                    <div>Survival: <strong className="text-emerald-700">{fb.survivalRating}★</strong></div>
                    <div>Immunity: <strong className="text-emerald-700">{fb.immunityRating}★</strong></div>
                    <div>Value: <strong className="text-emerald-700">{fb.valueRating}★</strong></div>
                  </div>

                  {/* Company Replies Thread */}
                  {fb.replies && fb.replies.length > 0 ? (
                    <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-[#2E7D4F] flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{t.companyReply}</span>
                      </span>
                      {fb.replies.map((reply) => (
                        <div key={reply.id} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800">
                          <div className="flex justify-between font-bold text-[#14342A] mb-1">
                            <span>{reply.adminName}</span>
                            <span className="text-[10px] font-normal text-slate-500">{reply.createdAt.split('T')[0]}</span>
                          </div>
                          <p className="leading-relaxed">{reply.replyText}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic pt-1">
                      {t.noRepliesYet}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
