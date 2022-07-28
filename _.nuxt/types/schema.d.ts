import { NuxtModule } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ["strapi"]?: typeof import("@nuxtjs/strapi").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
  }
  interface RuntimeConfig {
     MODE: string,

    STRAPI_URL: string,

    SEARCH_URL: string,

    MEILISEARCH_API_KEY: any,

    app: {
        baseURL: string,

        buildAssetsDir: string,

        cdnURL: string,
    },
  }
  interface PublicRuntimeConfig {
     MODE: string,

    STRAPI_URL: string,

    SEARCH_URL: string,

    MEILISEARCH_API_KEY: any,

    strapi: {
        url: string,

        prefix: string,

        version: string,

        cookie: any,
    },
  }
}