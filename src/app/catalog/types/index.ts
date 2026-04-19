export interface PriceRange {
  min: string;
  max: string;
}

export type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'nameAsc';

export interface CatalogFilters {
  selectedCategory: string;
  priceRange: PriceRange;
  sortBy: SortOption;
  searchQuery: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}
