import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.200', 'localhost:3000', '*.loca.lt', 'loca.lt'],
};

export default nextConfig;
