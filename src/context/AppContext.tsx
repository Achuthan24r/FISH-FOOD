import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, Batch, Feedback, Order } from '../types';
import { storageService, INITIAL_USERS } from '../services/storage';
import { translations } from '../i18n/translations';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchDemoRole: (role: 'farmer' | 'admin') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOnline: boolean;
  toggleOnlineSimulation: () => void;
  offlineQueueCount: number;
  triggerSync: () => void;
  batches: Batch[];
  refreshBatches: () => void;
  feedbackList: Feedback[];
  refreshFeedback: () => void;
  orders: Order[];
  refreshOrders: () => void;
  showFeedbackPrompt: boolean;
  feedbackPromptType: 'day30' | 'harvest' | null;
  openFeedbackModalWithPrompt: (promptType: 'day30' | 'harvest') => void;
  dismissFeedbackPrompt: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toasts: ToastState[];
  resetAppDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => storageService.getCurrentUser());
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('aquavigor_lang') as Language;
    return saved || currentUser.preferredLang || 'en';
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => storageService.getOfflineQueueCount());
  
  const [batches, setBatches] = useState<Batch[]>(() => storageService.getBatches());
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(() => storageService.getFeedback());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(true);
  const [feedbackPromptType, setFeedbackPromptType] = useState<'day30' | 'harvest' | null>('day30');
  
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const synced = storageService.flushOfflineQueue();
      setOfflineQueueCount(0);
      if (synced > 0) {
        showToast(`Back online! Synced ${synced} pending records.`, 'success');
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Network disconnected. Offline mode activated.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    storageService.setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('home');
    }
  };

  const switchDemoRole = (role: 'farmer' | 'admin') => {
    if (role === 'farmer') {
      setCurrentUser(INITIAL_USERS[0]); // Murugan Ramanathan
      showToast('Switched to Demo Farmer: Murugan Ramanathan (Nagapattinam)', 'info');
    } else {
      setCurrentUser(INITIAL_USERS[1]); // Admin Dr. S. Anbarasan
      showToast('Switched to Company Admin: Connected Minds', 'info');
    }
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('aquavigor_lang', newLang);
  };

  const toggleOnlineSimulation = () => {
    setIsOnline(prev => {
      const next = !prev;
      if (next) {
        const synced = storageService.flushOfflineQueue();
        setOfflineQueueCount(0);
        showToast(`Online restored! Synced ${synced} pending farm logs.`, 'success');
      } else {
        showToast('Simulated Offline Mode: Data will queue locally.', 'info');
      }
      return next;
    });
  };

  const triggerSync = () => {
    const synced = storageService.flushOfflineQueue();
    setOfflineQueueCount(0);
    refreshBatches();
    refreshFeedback();
    showToast(`Manual Sync Complete: ${synced} items synchronized with cloud.`, 'success');
  };

  const refreshBatches = () => {
    setBatches(storageService.getBatches());
    setOfflineQueueCount(storageService.getOfflineQueueCount());
  };

  const refreshFeedback = () => {
    setFeedbackList(storageService.getFeedback());
    setOfflineQueueCount(storageService.getOfflineQueueCount());
  };

  const refreshOrders = () => {
    setOrders(storageService.getOrders());
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissFeedbackPrompt = () => {
    setShowFeedbackPrompt(false);
  };

  const openFeedbackModalWithPrompt = (promptType: 'day30' | 'harvest') => {
    setFeedbackPromptType(promptType);
    setShowFeedbackPrompt(false);
    setCurrentTab('feedback');
  };

  const resetAppDemo = () => {
    storageService.resetToDemoData();
    setCurrentUserState(INITIAL_USERS[0]);
    setBatches(storageService.getBatches());
    setFeedbackList(storageService.getFeedback());
    setOrders(storageService.getOrders());
    setOfflineQueueCount(0);
    setShowFeedbackPrompt(true);
    setCurrentTab('home');
    showToast('Demo dataset refreshed to initial pristine state!', 'success');
  };

  const t = translations[lang] || translations.en;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchDemoRole,
        lang,
        setLang,
        t,
        currentTab,
        setCurrentTab,
        isOnline,
        toggleOnlineSimulation,
        offlineQueueCount,
        triggerSync,
        batches,
        refreshBatches,
        feedbackList,
        refreshFeedback,
        orders,
        refreshOrders,
        showFeedbackPrompt,
        feedbackPromptType,
        openFeedbackModalWithPrompt,
        dismissFeedbackPrompt,
        showToast,
        toasts,
        resetAppDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
