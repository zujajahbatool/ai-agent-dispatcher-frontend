/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;