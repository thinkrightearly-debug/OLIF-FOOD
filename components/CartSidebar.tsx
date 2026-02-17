
import React from 'react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = items.length > 0 ? 1500 : 0;
  const tax = subtotal * 0.05; // 5% VAT in Nigeria
  const total = subtotal + delivery + tax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Your Basket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <i className="fa-solid fa-utensils text-5xl mb-4 opacity-20"></i>
              <p>Your basket is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">₦{item.price.toLocaleString()} each</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#065F46]"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold text-slate-800">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₦{delivery.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (5%)</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-[#064E3B] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#065F46] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
            >
              Checkout Now
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
