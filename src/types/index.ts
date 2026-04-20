export interface ProductResult {
  store: string;
  price: string;
  rating: string;
  delivery: string;
  link: string;
  thumbnail?: string;
}

export interface ComparisonData {
  product: string;
  results: ProductResult[];
  best_deal: string;
  price_savings: string;
  recommendation: string;
}
