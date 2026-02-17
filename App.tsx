
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RestaurantCard from './components/RestaurantCard';
import CartSidebar from './components/CartSidebar';
import AIAssistant from './components/AIAssistant';
import RestaurantDetail from './components/RestaurantDetail';
import { MOCK_RESTAURANTS, COLORS } from './constants';
import { Restaurant, CartItem, UserRole, FoodCategory, MenuItem } from './types';
import { getFoodRecommendations } from './services/geminiService';

type View = 'home' | 'restaurants' | 'catering' | 'offers' | 'restaurant-detail' | 'checkout-success';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.Customer);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoadingRecs(true);
      try {
        const recs = await getFoodRecommendations("A fan of healthy and spicy local Nigerian food looking for a premium experience.");
        setRecommendations(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  const addToCart = (item: MenuItem, restaurantId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const filteredRestaurants = MOCK_RESTAURANTS.filter(res => {
    const matchesCategory = selectedCategory === 'All' || res.categories.includes(selectedCategory as FoodCategory);
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVoiceOrder = (itemName: string, qty: number) => {
    for (const res of MOCK_RESTAURANTS) {
      const item = res.menu.find(m => m.name.toLowerCase().includes(itemName.toLowerCase()));
      if (item) {
        for(let i=0; i<qty; i++) addToCart(item, res.id);
        break;
      }
    }
  };

  const openRestaurant = (id: string) => {
    const res = MOCK_RESTAURANTS.find(r => r.id === id);
    if (res) {
      setSelectedRestaurant(res);
      setCurrentView('restaurant-detail');
      window.scrollTo(0, 0);
    }
  };

  const handleCheckout = () => {
    setCart([]);
    setIsCartOpen(false);
    setCurrentView('checkout-success');
  };

  const renderCustomerContent = () => {
    if (currentView === 'checkout-success') {
      return (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-24 h-24 bg-emerald-100 text-[#064E3B] rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Order Confirmed!</h2>
          <p className="text-slate-600 mb-12 text-lg">Your gourmet experience is being prepared. Our premium courier will be at your door in approximately 35 minutes.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setCurrentView('home')} className="bg-[#064E3B] text-white px-8 py-4 rounded-2xl font-bold">Back to Home</button>
            <button className="border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50">Track Order</button>
          </div>
        </div>
      );
    }

    if (currentView === 'restaurant-detail' && selectedRestaurant) {
      return <RestaurantDetail restaurant={selectedRestaurant} onAddToCart={addToCart} onBack={() => setCurrentView('home')} />;
    }

    if (currentView === 'catering') {
      return (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="emerald-gradient p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">World-Class Event Catering</h2>
              <p className="text-emerald-50 text-lg opacity-80 mb-8">From corporate galas to intimate luxury weddings, OLIF brings the finest flavors to your special occasion.</p>
              <button className="bg-[#D4AF37] text-emerald-900 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform">Inquire Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" className="absolute top-0 right-0 h-full w-1/3 object-cover opacity-20 md:opacity-40" />
          </div>
        </div>
      );
    }

    if (currentView === 'offers') {
      return (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-12 text-center">Exclusive Member Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">First Order Bonus</h3>
              <p className="text-slate-600 mb-8">Get ₦2,000 off your first order of ₦10,000 or more. Use code: OLIFWELCOME</p>
              <button onClick={() => setCurrentView('restaurants')} className="text-[#064E3B] font-bold flex items-center gap-2 group">
                Claim Offer <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-50 text-[#064E3B] rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Refer & Earn</h3>
              <p className="text-slate-600 mb-8">Invite a friend to OLIF and earn ₦1,500 in your wallet when they complete their first order.</p>
              <button className="text-[#064E3B] font-bold flex items-center gap-2 group">
                Share Link <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
            <div className="bg-[#064E3B] p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20">
              <div className="w-16 h-16 bg-white/10 text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 text-2xl">
                <i className="fa-solid fa-crown"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Platinum Perks</h3>
              <p className="text-emerald-100/70 mb-8">Enjoy unlimited free delivery on orders over ₦15,000 for just ₦4,999/month.</p>
              <button className="bg-[#D4AF37] text-slate-900 px-6 py-3 rounded-xl font-bold">Join Platinum</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* AI Recommendations Section */}
        {currentView === 'home' && !loadingRecs && recommendations.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Curated for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-xl font-bold mb-2 font-serif">{rec.dish}</h3>
                  <p className="text-sm opacity-80 mb-4">{rec.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    <i className="fa-solid fa-sparkles"></i> AI Choice
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
            {['All', ...Object.values(FoodCategory)].map(cat => (
              <button 
                key={cat}
                onClick={() => { setSelectedCategory(cat as any); setCurrentView('restaurants'); }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-[#064E3B] text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-white text-slate-600 border border-gray-100 hover:border-[#064E3B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(currentView === 'home') setCurrentView('restaurants'); }}
              className="w-full bg-white border border-gray-100 rounded-full px-6 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 shadow-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          </div>
        </div>

        {/* Restaurant Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map(res => (
            <div key={res.id}>
              <RestaurantCard 
                restaurant={res} 
                onClick={openRestaurant}
              />
              <div className="mt-4 space-y-2">
                {res.menu.slice(0, 2).map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-2xl border border-gray-50 hover:border-[#064E3B]/20 transition-all cursor-pointer" onClick={() => openRestaurant(res.id)}>
                    <span className="text-sm font-medium">{item.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(item, res.id); }}
                      className="bg-gray-100 text-[#064E3B] w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#064E3B] hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    switch(currentRole) {
      case UserRole.Vendor:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Vendor Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Pending Orders</p>
                <p className="text-4xl font-bold text-[#064E3B]">48</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Sales Today</p>
                <p className="text-4xl font-bold text-[#D4AF37]">₦450,500</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Top Item</p>
                <p className="text-xl font-bold text-slate-800">Smoky Jollof</p>
              </div>
            </div>
          </div>
        );
      case UserRole.Rider:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Rider App</h2>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-[500px] relative">
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center italic text-slate-400">
                Map View (Abuja/Lagos Interface)
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white p-6 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Job</p>
                    <p className="text-lg font-bold">Delivery to Banana Island, Gate 4</p>
                  </div>
                  <button className="bg-[#064E3B] text-white px-6 py-2 rounded-xl font-bold">Mark Delivered</button>
                </div>
              </div>
            </div>
          </div>
        );
      case UserRole.Admin:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">System Analytics (NGN)</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="h-64 bg-gray-50 rounded-2xl flex items-end justify-between p-4 gap-2">
                {[40, 60, 45, 90, 100, 80, 50].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-full bg-[#064E3B] rounded-t-lg opacity-80"></div>
                ))}
              </div>
              <p className="text-center mt-4 text-sm text-slate-500">Revenue Growth (Across States)</p>
            </div>
          </div>
        );
      default:
        return renderCustomerContent();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onRoleSwitch={setCurrentRole}
        currentRole={currentRole}
        currentView={currentView}
        onViewChange={(v: any) => { setCurrentView(v); setCurrentRole(UserRole.Customer); }}
      />

      {/* Hero Section */}
      {currentRole === UserRole.Customer && currentView === 'home' && (
        <section className="relative h-[550px] md:h-[650px] overflow-hidden mesh-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
          
          {/* Background Image with Parallax-like effect */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1628143242636-9769919b4862?q=80&w=1964&auto=format&fit=crop" 
              alt="Hero BG" 
              className="w-full h-full object-cover scale-110"
            />
          </div>

          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="flex flex-col items-start text-white">
              <div className="bg-[#D4AF37] text-slate-900 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-bounce">
                Premium Nigerian Dining
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight drop-shadow-2xl">
                Taste the <br/>
                <span className="text-[#D4AF37]">Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-lg leading-relaxed font-light">
                Discover the finest Jollof, Suya, and local delicacies from Nigeria's top-rated kitchens, delivered with world-class precision.
              </p>
              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setCurrentView('restaurants')} 
                  className="bg-[#D4AF37] text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center gap-4 pulse-gold shadow-2xl"
                >
                  Order Now <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button 
                  onClick={() => setCurrentView('catering')} 
                  className="bg-white/5 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all"
                >
                  Book Catering
                </button>
              </div>

              {/* Stats/Badges */}
              <div className="mt-12 flex gap-8 items-center border-t border-white/10 pt-8 w-full">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#D4AF37]">25k+</span>
                  <span className="text-xs uppercase tracking-widest opacity-60">Happy Clients</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#D4AF37]">150+</span>
                  <span className="text-xs uppercase tracking-widest opacity-60">Top Kitchens</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#D4AF37]">4.9</span>
                  <span className="text-xs uppercase tracking-widest opacity-60">Avg. Rating</span>
                </div>
              </div>
            </div>

            {/* Floating Visual Element (Visible on Large Screens) */}
            <div className="hidden lg:flex justify-center items-center relative">
               <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] animate-pulse"></div>
               <img 
                 src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop" 
                 alt="Featured Dish" 
                 className="relative z-10 w-[450px] h-[450px] object-cover rounded-[4rem] shadow-2xl border-8 border-white/5 animate-float transform rotate-3"
               />
               <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl z-20 flex items-center gap-4 animate-bounce delay-700">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <div>
                    <p className="text-slate-900 font-black text-sm">Lightning Delivery</p>
                    <p className="text-slate-500 text-[10px]">Average 28 mins</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      <main className="bg-gray-50 flex-1">
        {renderDashboard()}
      </main>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      <AIAssistant onOrderCommand={handleVoiceOrder} cart={cart} />

      <footer className="bg-[#064E3B] text-white py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="text-3xl font-serif font-bold mb-6">OLIF<span className="text-[#D4AF37]">.</span>FOOD</div>
            <p className="text-emerald-100/60 leading-relaxed">
              Authentic African gourmet experience. Excellence in every bite, from our partners to your plate in Nigeria and beyond.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#D4AF37]">Company</h4>
            <ul className="space-y-4 text-sm opacity-70">
              <li><button onClick={() => setCurrentView('home')} className="hover:opacity-100">About Us</button></li>
              <li><button className="hover:opacity-100">Contact</button></li>
              <li><button className="hover:opacity-100">Privacy Policy</button></li>
              <li><button className="hover:opacity-100">Terms of Service</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#D4AF37]">Join Us</h4>
            <ul className="space-y-4 text-sm opacity-70">
              <li><button onClick={() => setCurrentRole(UserRole.Vendor)} className="hover:opacity-100">Become a Partner</button></li>
              <li><button onClick={() => setCurrentRole(UserRole.Rider)} className="hover:opacity-100">Drive with Us</button></li>
              <li><button onClick={() => setCurrentRole(UserRole.Admin)} className="hover:opacity-100">Merchant Dashboard</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#D4AF37]">Newsletter</h4>
            <p className="text-xs mb-4 opacity-60">Subscribe for premium offers and updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:ring-1 focus:ring-[#D4AF37]" />
              <button className="bg-[#D4AF37] text-slate-900 p-2 rounded-xl transition-transform hover:scale-110">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] opacity-40 uppercase tracking-widest">
          <div>© 2024 OLIF Food Nigeria. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#"><i className="fa-brands fa-instagram text-lg"></i></a>
            <a href="#"><i className="fa-brands fa-x-twitter text-lg"></i></a>
            <a href="#"><i className="fa-brands fa-facebook text-lg"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
