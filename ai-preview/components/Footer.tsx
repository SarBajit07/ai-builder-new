// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white shadow-lg p-4 text-center">
      © {new Date().getFullYear()} My E-commerce. All rights reserved.
    </footer>
  );
}