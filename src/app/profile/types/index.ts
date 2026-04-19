export interface User {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
}

export type TabType = 'profile' | 'orders';
