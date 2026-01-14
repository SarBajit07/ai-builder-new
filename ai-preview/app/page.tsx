// app/page.tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import dbClient from '@/lib/dbClient';
import type { Product } from '@/types/product';

export default async function Home() {
  const products: Product[] = await dbClient('products').select('*');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-bold mb-6">Product Listings</h1>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}