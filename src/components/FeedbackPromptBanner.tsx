import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BellRing, 
  MessageSquare, 
  X, 
  ChevronRight, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export const FeedbackPromptBanner: React.FC = () => {
  const { 
    showFeedbackPrompt, 
    dismissFeedbackPrompt, 
    openFeedbackModalWithPrompt,
    t, 
    lang,
    showToast 
  } = useApp();

  const [simulatedSmsSent, setSimulatedSmsSent] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  if (!showFeedbackPrompt) return null;

  const handleSendSimulatedSms = () => {
    setSimulatedSmsSent(true);
    showToast('Simulated Push & SMS Alert dispatched to +91 98401 23456!', 'success');
    setShowNotificationModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#14342A] via-[#1c493b] to-[#255e4d] text-white p-4 rounded-2xl shadow-elevated border border-[#F2A900]/40 mb-6 relative overflow-hidden animate-slide-up">
        {/* Subtle background glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#F2A900]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F2A900] text-[#14342A] flex items-center justify-center shrink-0 shadow-md animate-pulse-subtle">
              <BellRing className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F2A900] text-[#14342A]">
                  Day 30 Milestone
                </span>
                <span className="text-xs text-emerald-200">
                  Pond 2 • Vannamei Shrimp
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-white mt-1">
                {t.day30PromptTitle}
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5 max-w-xl">
                {t.day30PromptBody}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Simulate SMS / Push Trigger */}
            <button
              onClick={handleSendSimulatedSms}
              title="Test SMS & Push Notification trigger"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#F2A900]" />
              <span className="hidden xs:inline">Test Push/SMS</span>
            </button>

            {/* Direct Give Feedback Button */}
            <button
              id="prompt-give-feedback-btn"
              onClick={() => openFeedbackModalWithPrompt('day30')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F2A900] hover:bg-[#d99700] text-[#14342A] shadow-md transition transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.promptGiveReview}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss */}
            <button
              onClick={dismissFeedbackPrompt}
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              title={t.promptDismiss}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Push & SMS Dialog for Judges */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#2E7D4F]" />
                <h4 className="font-heading font-bold text-base text-[#14342A]">
                  Dispatched Push & SMS Preview
                </h4>
              </div>
              <button 
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Push Notification Simulation Card */}
              <div className="p-3 bg-slate-900 text-white rounded-xl shadow-inner border border-slate-700">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <span>🐟</span> AquaVigor Farm App
                  </span>
                  <span>Now</span>
                </div>
                <div className="font-bold text-xs text-[#F2A900]">
                  Day 30 Feed Evaluation Required!
                </div>
                <div className="text-[11px] text-slate-200 mt-0.5">
                  Murugan, your Pond 2 Vannamei shrimp completed 30 days on AquaVigor. Tap to submit your growth & colour rating in 30 seconds!
                </div>
              </div>

              {/* SMS Notification Simulation Card */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-800">
                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-semibold mb-1">
                  <span>SMS from AGRI-AQUAVIGOR</span>
                  <span>10:30 AM</span>
                </div>
                <p className="text-xs text-slate-700">
                  {lang === 'ta' 
                    ? "வணக்கம் முருகன்! ஆக்வா விகோர் தீவனத்தில் உங்கள் குளம் 2 இன்று 30 நாட்களை எட்டியுள்ளது. உங்கள் அனுபவத்தை பதிவு செய்து இலவச தீவன மாதிரி கூப்பன் பெறவும்: https://aquavigor.agri/review"
                    : "Vanakkam Murugan! Pond 2 Vannamei reached Day 30 on AquaVigor. Please share your growth & color feedback to receive a complimentary mineral booster pack: https://aquavigor.agri/review"
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  openFeedbackModalWithPrompt('day30');
                }}
                className="px-4 py-2 bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold rounded-xl transition"
              >
                Open Review Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
