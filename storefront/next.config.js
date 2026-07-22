const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOSTNAME || process.env.NEXT_PUBLIC_MINIO_ENDPOINT
const mediaHostHasScheme = mediaHost ? /^https?:\/\//.test(mediaHost) : false
const mediaUrl = mediaHost ? new URL(mediaHostHasScheme ? mediaHost : `https://${mediaHost}`) : null

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  logging: { fetches: { fullUrl: true } },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      ...(mediaUrl ? (mediaHostHasScheme ? [mediaUrl.protocol.replace(":", "")] : ["https", "http"]).map((protocol) => ({
        protocol,
        hostname: mediaUrl.hostname,
        ...(mediaUrl.port ? { port: mediaUrl.port } : {}),
      })) : []),
    ],
  },
}

module.exports = nextConfig
