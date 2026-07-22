# Medusa B2B for Railway

A Railway-ready distribution of the official [Medusa B2B Starter](https://github.com/medusajs/b2b-starter), with separate backend and storefront services, PostgreSQL, Redis, automatic initialization, and S3-compatible media storage.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/medusajs-20-storefront-b2b?referralCode=-Yg50p)

## Included

- Medusa 2.17.2 backend and Admin
- Next.js 15.5 storefront
- Company and employee management
- Spending limits and approval workflows
- Quote management and order editing
- Bulk add-to-cart, promotions, and product-option filtering
- Railway health checks, automatic admin setup, and publishable-key exchange
- Railway Bucket support through Medusa's stock S3 provider

The repository intentionally keeps the existing `backend/` and `storefront/` service roots so existing Railway template configuration continues to work.

## Railway resources

Create these resources in the template:

1. PostgreSQL
2. Redis
3. A Railway Bucket
4. A read-only Railway Function that proxies public `GET` and `HEAD` requests to the private bucket
5. Backend and storefront services from this repository

Railway Buckets do not support public objects. The proxy is therefore required for product images. It must never expose `PUT`, `POST`, `PATCH`, or `DELETE`.

## Backend bucket variables

Map the bucket's generated variables to the backend:

```env
S3_ACCESS_KEY_ID=${{Bucket.ACCESS_KEY_ID}}
S3_SECRET_ACCESS_KEY=${{Bucket.SECRET_ACCESS_KEY}}
S3_BUCKET=${{Bucket.BUCKET}}
S3_ENDPOINT=${{Bucket.ENDPOINT}}
S3_REGION=${{Bucket.REGION}}
S3_FILE_URL=https://${{bucket-proxy.RAILWAY_PUBLIC_DOMAIN}}
```

Use the bucket's `BUCKET` value, not `RAILWAY_BUCKET_NAME`. Do not set `S3_ACL` or `S3_FORCE_PATH_STYLE` for Railway Buckets. Create the proxy's public domain before referencing it in `S3_FILE_URL`.

The storefront needs the same public media host:

```env
NEXT_PUBLIC_MEDIA_HOSTNAME=${{bucket-proxy.RAILWAY_PUBLIC_DOMAIN}}
```

The stock provider does not create buckets or bucket policies. Existing deployments using only `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, and `MINIO_BUCKET` remain supported as a legacy fallback. New and legacy variable sets are never mixed.

If S3 configuration is incomplete, the backend logs a warning and falls back to local storage. Local files are ephemeral on Railway.

## Local development

Requirements: Node.js 20+, PostgreSQL 15+, Redis (optional), and pnpm 10+.

```bash
cd backend
cp .env.template .env
pnpm install
pnpm medusa db:migrate
pnpm seed
pnpm medusa user -e admin@test.com -p supersecret
pnpm dev
```

In another terminal:

```bash
cd storefront
cp .env.template .env.local
pnpm install
pnpm dev
```

The backend/Admin runs at `http://localhost:9000`; the storefront runs at `http://localhost:8000`.

## Updating an existing deployment

Before deploying this release:

1. Back up PostgreSQL.
2. Configure the Railway Bucket, proxy, and all `S3_*` variables.
3. Deploy the backend and allow `init-backend` to run the Medusa migrations.
4. Deploy the storefront with `NEXT_PUBLIC_MEDIA_HOSTNAME`.
5. Upload a test image and verify its returned URL works in a private browser window.

URLs are stored when media is uploaded. Files uploaded with an incorrect `S3_FILE_URL` must be re-uploaded after correcting the value.

## Notes

This template does not preconfigure production email, payment, or search providers. Add those integrations as needed.

For the standard D2C starter, see [medusajs-2.0-for-railway-boilerplate](https://github.com/rpuls/medusajs-2.0-for-railway-boilerplate).
