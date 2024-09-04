/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghzimmbewijtxwfqzadw.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
