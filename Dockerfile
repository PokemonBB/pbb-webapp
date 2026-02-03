# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ARG PUBLIC_API_BASE_URL
ARG PUBLIC_CDS_BASE_URL
ENV PUBLIC_API_BASE_URL=${PUBLIC_API_BASE_URL}
ENV PUBLIC_CDS_BASE_URL=${PUBLIC_CDS_BASE_URL}
RUN yarn build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy the built application from the builder stage
COPY --from=builder /app/build .

# Runtime environment injection: generate /usr/share/nginx/html/env.js at container start
RUN printf '#!/bin/sh\n' > /docker-entrypoint.d/99-env-js.sh \
 && printf 'echo "Generating env.js with ENVIRONMENT=\\$ENVIRONMENT"\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf 'cat > /usr/share/nginx/html/env.js << EOF\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf 'window.__ENV__ = Object.assign(window.__ENV__||{}, {\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf '  ENVIRONMENT: "\\${ENVIRONMENT:-local}"\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf '});\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf 'EOF\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf 'echo "Generated env.js:"\n' >> /docker-entrypoint.d/99-env-js.sh \
 && printf 'cat /usr/share/nginx/html/env.js\n' >> /docker-entrypoint.d/99-env-js.sh \
 && chmod +x /docker-entrypoint.d/99-env-js.sh

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
