export interface ProductSpec {
  name: string;
  value: string;
  percentage: number; // For performance bar charts
}

export interface ProductDetails {
  id: string;
  name: string;
  tagline: string;
  category: string;
  subcategory?: string;
  priceUSD: number;
  priceVES: number; // Venezuelan Bolivars exchange
  specs: ProductSpec[];
  highlights: string[];
  stock: "DISPONIBLE" | "BAJO STOCK" | "PEDIDO PREVIO";
  image?: string;
  images?: string[];
  isTrending?: boolean;
}

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  themeColor: string; // Tailind class for shadow/glow, e.g., 'cyan', 'yellow', 'emerald'
  accentClass: string; // Tailwind glow border color
  textGlowClass: string; // Tailwind custom text glow
  detailsId: string; // References a ProductDetails ID
}
