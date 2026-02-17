
import { Restaurant, FoodCategory } from './types';

export const COLORS = {
  emerald: '#064E3B',
  gold: '#D4AF37',
  goldLight: '#F1D279',
  white: '#FFFFFF',
  gray: '#F3F4F6'
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'The Lagos Kitchen',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop',
    rating: 4.9,
    reviews: 2450,
    deliveryFee: 1500,
    deliveryTime: '25-40 min',
    categories: [FoodCategory.Nigerian],
    menu: [
      {
        id: 'ng-1',
        name: 'Smoky Party Jollof Rice',
        description: 'Authentic Nigerian party-style jollof rice served with fried plantain, moin-moin, and choice of protein (Beef/Chicken).',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1628143242636-9769919b4862?q=80&w=1964&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 4.9,
        prepTime: '20 min',
        ingredients: ['Long grain rice', 'Bell peppers', 'Tomatoes', 'Scotch bonnet', 'Thyme', 'Bay leaf']
      },
      {
        id: 'ng-2',
        name: 'Pounded Yam & Egusi Soup',
        description: 'Soft, fluffy pounded yam served with rich Egusi soup containing assorted meats, stockfish, and ponmo.',
        price: 7200,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 4.8,
        prepTime: '25 min',
        ingredients: ['Yam', 'Melon seeds', 'Spinach', 'Assorted meat', 'Palm oil', 'Crayfish']
      },
      {
        id: 'ng-3',
        name: 'Amala & Ewedu with Gbegiri',
        description: 'Authentic Oyo-style Amala served with viscous Ewedu, bean soup (Gbegiri), and signature stew with assorted meat.',
        price: 6800,
        image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 5.0,
        prepTime: '15 min',
        ingredients: ['Yam flour', 'Jute leaves', 'Honey beans', 'Beef', 'Tripe']
      },
      {
        id: 'ng-4',
        name: 'Assorted Meat Pepper Soup',
        description: 'Spicy, aromatic broth made with a blend of local spices and various cuts of tender meat.',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 4.7,
        prepTime: '15 min',
        ingredients: ['Goat meat', 'Scent leaves', 'Pepper soup spice', 'Ginger', 'Garlic']
      }
    ]
  },
  {
    id: 'res-suya',
    name: 'Aboki Suya Central',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop',
    rating: 4.8,
    reviews: 1800,
    deliveryFee: 1200,
    deliveryTime: '20-30 min',
    categories: [FoodCategory.Nigerian, FoodCategory.FastFood],
    menu: [
      {
        id: 'ng-5',
        name: 'Beef Suya Platter',
        description: 'Thinly sliced grilled beef marinated in spicy yaji pepper, served with onions, tomatoes, and cabbage.',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6e9481bfa?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.FastFood,
        rating: 4.9,
        prepTime: '15 min',
        ingredients: ['Beef', 'Kuli-kuli', 'Ginger', 'Cayenne pepper', 'Onions']
      },
      {
        id: 'ng-6',
        name: 'Kilishi (Jerky)',
        description: 'Premium sun-dried spiced beef jerky. A classic Northern Nigerian delicacy.',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1599481238505-b8b0537a3f77?q=80&w=1964&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 4.8,
        prepTime: '5 min',
        ingredients: ['Dried beef', 'Peanut paste', 'Spices']
      }
    ]
  },
  {
    id: 'res-delta',
    name: 'Banga Delight',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format&fit=crop',
    rating: 4.7,
    reviews: 950,
    deliveryFee: 2000,
    deliveryTime: '45-60 min',
    categories: [FoodCategory.Nigerian],
    menu: [
      {
        id: 'ng-7',
        name: 'Banga Soup & Starch',
        description: 'Traditional palm nut fruit soup served with smooth yellow starch and fresh catfish.',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 4.9,
        prepTime: '40 min',
        ingredients: ['Palm nut extract', 'Beletete leaves', 'Oburunbebe stick', 'Catfish', 'Periwinkles']
      },
      {
        id: 'ng-8',
        name: 'Fisherman Soup',
        description: 'An indulgent seafood broth loaded with crab, prawns, fresh fish, and local spices.',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1559740196-196ad52631c6?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Nigerian,
        rating: 5.0,
        prepTime: '30 min',
        ingredients: ['Crabs', 'Prawns', 'Fish', 'Oziza leaves', 'Okro']
      }
    ]
  },
  {
    id: 'res-healthy',
    name: 'Greenleaf Abuja',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
    rating: 4.6,
    reviews: 620,
    deliveryFee: 1800,
    deliveryTime: '20-35 min',
    categories: [FoodCategory.Healthy],
    menu: [
      {
        id: 'ng-9',
        name: 'Ofada Rice & Sauce',
        description: 'Unpolished local rice served with a fiery green pepper sauce (Ayamase) and assorted boiled meats.',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1512058560366-cd2429597e70?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Healthy,
        rating: 4.7,
        prepTime: '25 min',
        ingredients: ['Ofada rice', 'Green peppers', 'Locust beans (Iru)', 'Bleached palm oil', 'Eggs']
      },
      {
        id: 'ng-10',
        name: 'Beans & Corn (Adalu)',
        description: 'A nutritious stew of honey beans and sweet corn, slow-cooked in a spicy palm oil base.',
        price: 4000,
        image: 'https://images.unsplash.com/photo-1547592115-305886470377?q=80&w=2070&auto=format&fit=crop',
        category: FoodCategory.Healthy,
        rating: 4.5,
        prepTime: '20 min',
        ingredients: ['Honey beans', 'Sweet corn', 'Palm oil', 'Onions', 'Crayfish']
      }
    ]
  }
];
