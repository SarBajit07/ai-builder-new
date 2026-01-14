// components/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth/core/types';

export default function Header() {
  const session: Session | null = useSession().data;

  return (
    <header className="bg-white shadow-lg p-4 flex justify-between items-center">
      <Link href="/" passHref>
        <a>My E-commerce</a>
      </Link>
      {session ? (
        <div className="flex gap-2">
          <Button onClick={() => signOut()} variant="destructive">Sign Out</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      )}
    </header>
  );
}