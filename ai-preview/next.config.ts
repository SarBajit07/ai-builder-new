/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... your existing config (CSP headers, etc.)

  turbopack: {
    root: process.cwd(), // Tells Turbopack the real root is the parent project
  },
};

export default nextConfig;