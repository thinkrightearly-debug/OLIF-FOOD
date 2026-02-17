
import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div 
      onClick={() => onClick(restaurant.id)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <i className="fa-solid fa-star text-amber-400"></i>
          {restaurant.rating}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {restaurant.categories.map(cat => (
            <span key={cat} className="bg-[#064E3B] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold">
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[#064E3B] transition-colors">{restaurant.name}</h3>
        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-clock opacity-50"></i>
            {restaurant.deliveryTime}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-motorcycle opacity-50"></i>
            ₦{restaurant.deliveryFee.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
