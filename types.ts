
export enum FoodCategory {
  Nigerian = 'Local Nigerian',
  Continental = 'Continental',
  FastFood = 'Fast Food',
  Healthy = 'Healthy',
  Dessert = 'Dessert'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  rating: number;
  prepTime: string;
  ingredients: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  deliveryFee: number;
  deliveryTime: string;
  categories: FoodCategory[];
  menu: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
}

export enum UserRole {
  Customer = 'Customer',
  Vendor = 'Vendor',
  Rider = 'Rider',
  Admin = 'Admin'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'on-the-way' | 'delivered';
  timestamp: Date;
  deliveryLocation: string;
}
