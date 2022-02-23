/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "storage.googleapis.com",
      "scontent-ams4-1.xx.fbcdn.net",
      "i.scdn.co",
    ],
  },
};

module.exports = nextConfig;
