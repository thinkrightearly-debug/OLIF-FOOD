
import React from 'react';
import { UserRole } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onRoleSwitch: (role: UserRole) => void;
  currentRole: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onRoleSwitch, currentRole, currentView, onViewChange }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <div 
          onClick={() => onViewChange('home')}
          className="text-2xl font-serif font-bold text-[#064E3B] tracking-tight cursor-pointer"
        >
          OLIF<span className="text-[#D4AF37]">.</span>FOOD
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onViewChange('restaurants')} 
            className={`transition-colors ${currentView === 'restaurants' ? 'text-[#064E3B] font-bold' : 'hover:text-[#064E3B]'}`}
          >
            Restaurants
          </button>
          <button 
            onClick={() => onViewChange('catering')} 
            className={`transition-colors ${currentView === 'catering' ? 'text-[#064E3B] font-bold' : 'hover:text-[#064E3B]'}`}
          >
            Catering
          </button>
          <button 
            onClick={() => onViewChange('offers')} 
            className={`transition-colors ${currentView === 'offers' ? 'text-[#064E3B] font-bold' : 'hover:text-[#064E3B]'}`}
          >
            Offers
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select 
          className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
          value={currentRole}
          onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
        >
          <option value={UserRole.Customer}>Customer</option>
          <option value={UserRole.Vendor}>Vendor</option>
          <option value={UserRole.Rider}>Rider</option>
          <option value={UserRole.Admin}>Admin</option>
        </select>

        <button 
          onClick={() => onViewChange('restaurants')}
          className="p-2 text-slate-600 hover:text-[#064E3B] relative"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        
        <button 
          onClick={onCartClick}
          className="bg-[#064E3B] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#065F46] transition-all shadow-lg shadow-emerald-900/10"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="font-semibold">{cartCount}</span>
        </button>

        <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-[#D4AF37] overflow-hidden cursor-pointer hover:scale-105 transition-transform">
          <img src="https://picsum.photos/seed/user/100" alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
