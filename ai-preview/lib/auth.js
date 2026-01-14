// lib/auth.js
import { getServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    session: {
      jwt: true,
    },
  });
}