export interface FavoriteItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}
