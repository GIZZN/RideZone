export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ReactNode;
}

export interface Advantage {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Stat {
  number: string;
  text: string;
}
