import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { storageService, INITIAL_PRODUCTS } from '../services/storage';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Package, 
  FileText, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const OrdersScreen: React.FC = () => {
  const { currentUser, orders, refreshOrders, t, showToast } = useApp();

  const product = INITIAL_PRODUCTS[0];
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  // Form State
  const [quantityBags, setQuantityBags] = useState<number>(20);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    'Survey No. 42/B, Estuary Road, Velankanni Taluk'
  );
  const [district, setDistrict] = useState<string>(currentUser.district || 'Nagapattinam');
  const [contactPhone, setContactPhone] = useState<string>(currentUser.phone || '+91 98401 23456');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('Unload near Pond 2 pump house');

  const unitPrice = product.priceInr; // ₹1,850
  const totalPrice = quantityBags * unitPrice;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityBags <= 0) {
      showToast('Please select at least 1 bag', 'error');
      return;
    }

    const created = storageService.addOrder({
      userId: currentUser.id,
      farmerName: currentUser.name,
      contactPhone: contactPhone,
      district: district,
      productId: product.id,
      productName: product.name,
      quantityBags: quantityBags,
      bagSizeKg: product.bagWeightKg,
      totalPriceInr: totalPrice,
      deliveryAddress: `${deliveryAddress}, ${district}`,
      notes: deliveryNotes
    });

    refreshOrders();
    showToast(`Order #${created.id} placed! Agronomy logistic team dispatched confirmation.`, 'success');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'requested':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">{t.orderStatusRequested}</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">{t.orderStatusConfirmed}</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900">{t.orderStatusDispatched}</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">{t.orderStatusDelivered}</span>;
    }
  };

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'requested': return 1;
      case 'confirmed': return 2;
      case 'dispatched': return 3;
      case 'delivered': return 4;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#14342A] flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-[#2E7D4F]" />
            <span>{t.orderTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.orderSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-center">
          <Truck className="w-4 h-4 text-[#2E7D4F]" />
          <span>Express Delivery to Tamil Nadu Farms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Request Quote & Order (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl shadow-soft border border-slate-200/80 space-y-5">
          <h2 className="font-heading font-bold text-lg text-[#14342A] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2E7D4F]" />
            <span>Order Placement</span>
          </h2>

          <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs font-medium">
            
            {/* Product Card Details */}
            <div className="p-3.5 rounded-2xl bg-sand-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#14342A]">CHANNA PELLET™ Complete Nutrition</h4>
                <p className="text-[11px] text-slate-500">{t.bagSize}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-[#2E7D4F]">₹{unitPrice}</span>
                <span className="text-[10px] text-slate-500 block">per bag</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1.5">
                <span>{t.bagCount}</span>
                <span className="text-emerald-700 text-sm font-bold font-mono">
                  {quantityBags} Bags ({(quantityBags * 25).toLocaleString()} kg)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quantityBags}
                  onChange={(e) => setQuantityBags(Number(e.target.value))}
                  className="flex-1 accent-[#2E7D4F]"
                />
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={quantityBags}
                  onChange={(e) => setQuantityBags(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 text-center font-bold text-sm border rounded-lg"
                />
              </div>
            </div>

            {/* Delivery District & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.districtSelect}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none"
                >
                  <option value="Nagapattinam">Nagapattinam</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Cuddalore">Cuddalore</option>
                  <option value="Ramanathapuram">Ramanathapuram</option>
                  <option value="Thoothukudi">Thoothukudi</option>
                  <option value="Mayiladuthurai">Mayiladuthurai</option>
                  <option value="Tiruvallur">Tiruvallur</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.phoneContact}</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.deliveryLocation}</label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Farm Survey No., Village road landmark..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unloading Instructions</label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Call before dispatch, unload near generator shed"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Total Price Invoice Banner */}
            <div className="p-4 rounded-2xl bg-[#14342A] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">{t.totalAmount}</span>
                <span className="text-2xl font-heading font-bold text-[#F2A900]">
                  ₹{totalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-300 block">Inclusive of 5% GST & Freight</span>
              </div>

              <div className="text-right text-[10px] text-emerald-200">
                <span>Free Express Delivery</span>
              </div>
            </div>

            <button
              type="submit"
              id="btn-place-order-submit"
              className="w-full py-3.5 rounded-2xl bg-[#2E7D4F] hover:bg-[#215c3a] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{t.placeOrderButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Section: My Orders & 4-Stage Tracker (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#14342A]">
              {t.myOrders} ({userOrders.length})
            </h2>
            <span className="text-xs text-slate-500">Live Logistics Tracker</span>
          </div>

          <div className="space-y-4">
            {userOrders.map((ord) => {
              const currentStep = getStatusStepIndex(ord.status);
              return (
                <div key={ord.id} className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-slate-200/80 space-y-4">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#14342A]">{ord.id}</span>
                        <span className="font-bold text-xs text-slate-600">• {ord.quantityBags} Bags ({ord.quantityBags * 25} kg)</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ord.deliveryAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[#14342A]">
                        ₹{ord.totalPriceInr.toLocaleString()}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>
                  </div>

                  {/* 4-Stage Stepper: Requested -> Confirmed -> Dispatched -> Delivered */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 1 ? 'bg-[#2E7D4F] text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                        }`}>
                          ✓
                        </div>
                        <span className="text-[10px] font-semibold mt-1 text-[#14342A]">
                          Requested
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 2 ? 'bg-[#2E7D4F] text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep >= 2 ? '✓' : '2'}
                        </div>
                        <span className="text-[10px] font-semibold mt-1 text-[#14342A]">
                          Confirmed
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 3 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep >= 3 ? '✓' : '3'}
                        </div>
                        <span className="text-[10px] font-semibold mt-1 text-[#14342A]">
                          Dispatched
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          currentStep >= 4 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep >= 4 ? '✓' : '4'}
                        </div>
                        <span className="text-[10px] font-semibold mt-1 text-[#14342A]">
                          Delivered
                        </span>
                      </div>

                    </div>
                  </div>

                  {ord.notes && (
                    <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                      <strong>Logistics Note:</strong> {ord.notes}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
