import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { BatchesScreen } from './screens/BatchesScreen';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';
import { ProductScreen } from './screens/ProductScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const MainLayout: React.FC = () => {
  const { currentTab, currentUser } = useApp();

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return currentUser.role === 'admin' ? <AdminDashboardScreen /> : <HomeScreen />;
      case 'batches':
        return <BatchesScreen />;
      case 'calc':
        return <CalculatorScreen />;
      case 'feedback':
        return <FeedbackScreen />;
      case 'product':
        return <ProductScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'admin':
        return <AdminDashboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] flex flex-col selection:bg-[#2E7D4F] selection:text-white">
      <Header />
      <BottomNav />
      <ToastContainer />
      
      <main className="flex-1 w-full">
        {renderScreen()}
      </main>
    </div>
  );
};

export default function App() {
  return <MainLayout />;
}
