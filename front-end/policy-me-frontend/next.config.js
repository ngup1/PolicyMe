/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    experimental: {
      forceDynamic: true, // Forces all pages (like /oauth-error) to render dynamically
    },
    generateStaticParams: () => [], // Disables static page generation
  };
  
  module.exports = nextConfig;
  