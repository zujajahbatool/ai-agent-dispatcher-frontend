/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;