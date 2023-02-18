/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./styles'],
    prependData: `@import "~@/styles/_variables.scss"; @import "~@/styles/_mixins.scss";`,
  },
}

module.exports = nextConfig;
