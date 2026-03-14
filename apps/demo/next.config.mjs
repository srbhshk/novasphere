/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: [
    "@novasphere/tokens",
    "@novasphere/agent-core",
    "@novasphere/tenant-core",
    "@novasphere/ui-glass",
    "@novasphere/ui-bento",
    "@novasphere/ui-charts",
    "@novasphere/ui-agent",
    "@novasphere/ui-auth",
    "@novasphere/ui-shell",
  ],
};

export default nextConfig;
