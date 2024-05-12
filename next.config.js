/** @type {import('next').NextConfig} */
require('dotenv').config({ path: `${__dirname}/env` });
const { createSecureHeaders } = require("next-secure-headers");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

const production = process.env.NODE_ENV === "production";

const headers = async() => {
  return [
    {
      source: "/(.*)",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            styleSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'self'"],
            imgSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "data:", "https://tile.openstreetmap.org"],
            baseURI: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: true,
          },
        },
        frameGuard: "deny",
        noopen: "noopen",
        nosniff: "nosniff",
        xssProtection: "sanitize",
        forceHTTPSRedirect: [
          true,
          { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
        ],
        referrerPolicy: "strict-origin-when-cross-origin",
      }),
    },   
  ];
}

const webpack = (config) => {  
  if (!production) return config;
  config.output.crossOriginLoading = "anonymous";
  config.plugins.push(
    new SubresourceIntegrityPlugin({
      contenthash: ["sha256", "sha384"],
      realContentHash: true
    })
  );
  return config;
}


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: headers,
  webpack: webpack,
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `
      @import "~@/styles/abstracts/_variables.scss";
      @import "~@/styles/abstracts/_mixins.scss";
      @import "~@/styles/abstracts/_animations.scss";
    `,
  },
  env: {
    DOMAIN_ROOT: process.env.DOMAIN_ROOT,
    API_SECRET: process.env.API_SECRET,
    TEMP_LOGIN_STATE: process.env.TEMP_LOGIN_STATE
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMAGE_ROOT,
        pathname: '**',
      },
    ],
  },
  transpilePackages: ['ol', 'rlayers']
}

module.exports = nextConfig;
