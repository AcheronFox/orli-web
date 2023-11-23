/** @type {import('next').NextConfig} */
require('dotenv').config({ path: `${__dirname}/env` });


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@import "~@/styles/_variables.scss"; @import "~@/styles/_mixins.scss";`,
  },
  env: {
    DOMAIN_ROOT: process.env.DOMAIN_ROOT
  },
}

module.exports = nextConfig;
