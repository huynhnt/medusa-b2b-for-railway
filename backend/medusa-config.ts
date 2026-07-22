import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const hasS3Config = Boolean(process.env.S3_FILE_URL || process.env.S3_ACCESS_KEY_ID || process.env.S3_SECRET_ACCESS_KEY || process.env.S3_BUCKET || process.env.S3_ENDPOINT);
const normalizeLegacyMinioUrl = (endpoint?: string) => {
  if (!endpoint) return undefined;
  const withScheme = /^https?:\/\//.test(endpoint) ? endpoint : `https://${endpoint}`;
  return new URL(withScheme).toString().replace(/\/+$/, "");
};
const legacyMinioUrl = hasS3Config ? undefined : normalizeLegacyMinioUrl(process.env.MINIO_ENDPOINT);
const legacyMinioBucket = process.env.MINIO_BUCKET || "medusa-media";
const parseBoolean = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : ["true", "1", "yes"].includes(value.toLowerCase());
const s3 = {
  accessKeyId: hasS3Config ? process.env.S3_ACCESS_KEY_ID : process.env.MINIO_ACCESS_KEY,
  secretAccessKey: hasS3Config ? process.env.S3_SECRET_ACCESS_KEY : process.env.MINIO_SECRET_KEY,
  bucket: hasS3Config ? process.env.S3_BUCKET : legacyMinioUrl ? legacyMinioBucket : undefined,
  endpoint: hasS3Config ? process.env.S3_ENDPOINT : legacyMinioUrl,
  region: process.env.S3_REGION || "us-east-1",
  fileUrl: hasS3Config ? process.env.S3_FILE_URL : legacyMinioUrl ? `${legacyMinioUrl}/${legacyMinioBucket}` : undefined,
  forcePathStyle: parseBoolean(process.env.S3_FORCE_PATH_STYLE, Boolean(legacyMinioUrl)),
  acl: process.env.S3_ACL || false,
};
const s3Required = { S3_ACCESS_KEY_ID: s3.accessKeyId, S3_SECRET_ACCESS_KEY: s3.secretAccessKey, S3_BUCKET: s3.bucket, S3_FILE_URL: s3.fileUrl };
const s3Enabled = Object.values(s3Required).every(Boolean);
if (!s3Enabled && (s3.endpoint || Object.values(s3Required).some(Boolean))) {
  const missing = Object.entries(s3Required).filter(([, value]) => !value).map(([name]) => name);
  console.warn(`S3 file storage is only partially configured - missing: ${missing.join(", ")}. Falling back to local file storage, which is ephemeral on Railway!`);
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: {
    [COMPANY_MODULE]: { resolve: "./modules/company" },
    [QUOTE_MODULE]: { resolve: "./modules/quote" },
    [APPROVAL_MODULE]: { resolve: "./modules/approval" },
    [Modules.FILE]: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: s3Enabled ? [{
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            file_url: s3.fileUrl,
            access_key_id: s3.accessKeyId,
            secret_access_key: s3.secretAccessKey,
            region: s3.region,
            bucket: s3.bucket,
            endpoint: s3.endpoint,
            acl: s3.acl,
            download_file_duration: 24 * 60 * 60,
            additional_client_config: { forcePathStyle: s3.forcePathStyle },
          },
        }] : [{
          resolve: "@medusajs/medusa/file-local",
          id: "local",
          options: { upload_dir: "static", backend_url: `${process.env.BACKEND_URL || "http://localhost:9000"}/static` },
        }],
      },
    },
    ...(process.env.REDIS_URL ? {
      [Modules.EVENT_BUS]: { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl: process.env.REDIS_URL } },
      [Modules.CACHE]: { resolve: "@medusajs/medusa/cache-redis", options: { redisUrl: process.env.REDIS_URL } },
      [Modules.WORKFLOW_ENGINE]: { resolve: "@medusajs/medusa/workflow-engine-redis", options: { redis: { url: process.env.REDIS_URL } } },
    } : {
      [Modules.CACHE]: { resolve: "@medusajs/medusa/cache-inmemory" },
      [Modules.WORKFLOW_ENGINE]: { resolve: "@medusajs/medusa/workflow-engine-inmemory" },
    }),
  },
});
