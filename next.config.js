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
            imgSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
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
        referrerPolicy: "same-origin",
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
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@import "~@/styles/_variables.scss"; @import "~@/styles/_mixins.scss";`,
  },
}

module.exports = nextConfig;
