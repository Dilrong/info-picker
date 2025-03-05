import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nrkhoyjejnrvlqlxcbcp.supabase.co",
        pathname: "/storage/v1/object/sign/channels/**",
      },
    ],
  },
};

export default nextConfig;
