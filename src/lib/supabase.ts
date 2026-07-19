import { createClient } from '@supabase/supabase-js';
import { ProductDetails } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are set
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Sync / Load products from Supabase
 * Fallback to local storage or defaults if Supabase is not configured
 */
export async function getSupabaseProducts(fallbackProducts: ProductDetails[]): Promise<ProductDetails[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase is not configured. Using local fallback data.");
    return fallbackProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products from Supabase:", error.message);
      return fallbackProducts;
    }

    if (data && data.length > 0) {
      // Map Supabase columns back to our custom typescript product format if necessary
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        tagline: item.tagline,
        priceUSD: item.price_usd || item.priceUSD,
        priceVES: item.price_ves || item.priceVES,
        category: item.category,
        subcategory: item.subcategory,
        stock: item.stock || 'DISPONIBLE',
        isTrending: !!item.is_trending || !!item.isTrending,
        highlights: Array.isArray(item.highlights) ? item.highlights : JSON.parse(item.highlights || '[]'),
        image: item.image,
        images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
        specs: Array.isArray(item.specs) ? item.specs : JSON.parse(item.specs || '[]'),
      }));
    }

    // If table is empty, seed with initial products
    await seedSupabaseProducts(fallbackProducts);
    return fallbackProducts;
  } catch (err) {
    console.error("Failed to connect with Supabase products table:", err);
    return fallbackProducts;
  }
}

/**
 * Seed initial data to Supabase if empty
 */
async function seedSupabaseProducts(products: ProductDetails[]) {
  if (!supabase) return;
  try {
    const payload = products.map(p => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      price_usd: p.priceUSD,
      price_ves: p.priceVES,
      category: p.category,
      subcategory: p.subcategory,
      stock: p.stock,
      is_trending: p.isTrending,
      highlights: JSON.stringify(p.highlights || []),
      image: p.image,
      images: JSON.stringify(p.images || []),
      specs: JSON.stringify(p.specs || []),
    }));

    const { error } = await supabase.from('products').insert(payload);
    if (error) {
      console.error("Error seeding products to Supabase:", error.message);
    } else {
      console.log("Successfully seeded database with initial products!");
    }
  } catch (e) {
    console.error("Failed to seed Supabase:", e);
  }
}

/**
 * Upsert or Save a single product to Supabase
 */
export async function saveProductToSupabase(product: ProductDetails): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const payload = {
      id: product.id,
      name: product.name,
      tagline: product.tagline,
      price_usd: product.priceUSD,
      price_ves: product.priceVES,
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock,
      is_trending: product.isTrending,
      highlights: JSON.stringify(product.highlights || []),
      image: product.image,
      images: JSON.stringify(product.images || []),
      specs: JSON.stringify(product.specs || []),
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Error saving product to Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save product to Supabase:", err);
    return false;
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteProductFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting product from Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete product from Supabase:", err);
    return false;
  }
}
