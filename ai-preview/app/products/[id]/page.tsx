// app/products/[id]/page.tsx
import { useParams } from 'next/navigation';
import dbClient from '@/lib/dbClient';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

export default async function ProductPage() {
  const params = useParams();
  const productId: string | undefined = params.id;

  if (!productId) return <div>Product not found</div>;

  const product: Product | null = await dbClient('products').select('*').eq('id', parseInt(productId)).single().then((response) => response.data);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-lg p-4">
        <h1 className="text-xl font-bold">Product Details</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <img src={product.image} alt={product.name} width={300} height={300} className="rounded-lg" />
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <div className="flex items-center gap-4">
            <span>Price: ${product.price.toFixed(2)}</span>
            {session && (
              <Button>Add to Cart</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}