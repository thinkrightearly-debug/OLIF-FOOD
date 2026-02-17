
import React from 'react';
import { Restaurant, MenuItem } from '../types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem, restaurantId: string) => void;
  onBack: () => void;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onAddToCart, onBack }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </button>
        </div>
        <div className="absolute bottom-12 left-6 right-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {restaurant.categories.map(c => (
                  <span key={c} className="bg-[#D4AF37] text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">{restaurant.name}</h1>
              <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
                <span className="flex items-center gap-2"><i className="fa-solid fa-star text-[#D4AF37]"></i> {restaurant.rating} ({restaurant.reviews} reviews)</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-clock opacity-60"></i> {restaurant.deliveryTime}</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-motorcycle opacity-60"></i> ₦{restaurant.deliveryFee.toLocaleString()} delivery</span>
              </div>
            </div>
            <button className="bg-white text-[#064E3B] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-50 transition-colors">
              <i className="fa-solid fa-share"></i> Share Experience
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-gray-100 pb-4">Full Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurant.menu.map((item) => (
                <div key={item.id} className="group bg-gray-50/50 rounded-3xl p-4 border border-transparent hover:border-[#064E3B]/10 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 mb-1">{item.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#064E3B]">₦{item.price.toLocaleString()}</span>
                        <button 
                          onClick={() => onAddToCart(item, restaurant.id)}
                          className="bg-[#064E3B] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#065F46] transition-all shadow-lg shadow-emerald-900/10"
                        >
                          <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-6">About the Kitchen</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Led by master chefs specialized in authentic Nigerian and global flavors, our kitchen uses only the freshest ingredients sourced daily from local premium markets.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm font-medium">
                <i className="fa-solid fa-award text-[#D4AF37]"></i>
                <span>Michelin Standard Quality</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <i className="fa-solid fa-leaf text-emerald-600"></i>
                <span>Fresh Local Sourcing</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <i className="fa-solid fa-shield-heart text-blue-500"></i>
                <span>Verified Hygiene Standard</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#D4AF37]/10 rounded-[2rem] p-8 border border-[#D4AF37]/20">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Premium Loyalty</h3>
            <p className="text-slate-700 text-xs mb-6">Earn TRE Points with this order. Use points for exclusive rewards and discounts at our partner restaurants.</p>
            <button className="w-full bg-[#D4AF37] text-slate-900 py-3 rounded-xl font-bold text-sm">Join Platinum Club</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
