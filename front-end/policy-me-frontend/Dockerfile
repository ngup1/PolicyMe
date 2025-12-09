# --- Stage 1: Build the Next.js frontend ---
FROM node:20 AS build

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

RUN npm install

# Copy all project files
COPY . .

# --- Disable Next.js prerendering + static export ---
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_RUNTIME_BUILD=true
ENV NEXT_FORCE_DYNAMIC=true
ENV NEXT_DISABLE_STATIC_EXPORT=true
ENV NEXT_SHOULD_SKIP_STATIC_GENERATION=true
ENV NODE_ENV=production

# --- Inject a build-time config override ---
RUN echo "export const dynamic = 'force-dynamic';\nexport const fetchCache = 'force-no-store';" > ./src/app/force-dynamic-config.js

# --- Build with standard compiler (no Turbopack, no lint) ---
RUN npx next build --no-lint

# --- Stage 2: Run the production build ---
FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]
