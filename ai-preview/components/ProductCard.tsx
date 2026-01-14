// components/ProductCard.tsx
import type { Product } from '@/types/product';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={product.image} alt={product.name} width={300} height={200} />
        <h3 className="text-xl font-bold p-4">{product.name}</h3>
      </div>
    </Link>
  );
}