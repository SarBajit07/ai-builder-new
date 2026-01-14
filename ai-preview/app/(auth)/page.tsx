// app/(auth)/page.tsx
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { Session } from 'next-auth/core/types';

export default function AuthPage() {
  const session: Session | null = useSession().data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <Button onClick={() => signOut()} variant="destructive">Sign Out</Button>
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </div>
  );
}