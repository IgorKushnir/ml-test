import {defineNuxtConfig} from 'nuxt/config'
import graphql from '@rollup/plugin-graphql';

export default defineNuxtConfig({
  ssr: true,

  nitro: {
      prerender: {
          crawlLinks: true,
          routes: ['/'],
          ignore: [
            "/inspiration", '/pl/inspiracja', 
            '/moodboard', '/pl/moodboard', 
            '/news', '/pl/aktualnosci', 
            '/press-about-us', '/pl/prasa', 
            '/request-an-appointment', 
            '/newsletter', 
            '/store-finder', '/pl/wyszukiwarka-sklepow',
            '/product(\\/[^?]*)?\\?.*$',
            '/pl/product(\\/[^?]*)?\\?.*$',
            '/dress(\\/[^?]*)?\\?.*$',
            '/pl/suknie(\\/[^?]*)?\\?.*$',
            '/accessories(\\/[^?]*)?\\?.*$',
            '/pl/akcesoria(\\/[^?]*)?\\?.*$',
            '/veils(\\/[^?]*)?\\?.*$',
            '/pl/welony(\\/[^?]*)?\\?.*$',
        ],
        }
    },

  css: [
      '@/assets/style/main.scss',
  ],

  modules: [
      '@nuxtjs/strapi',
      '@nuxtjs/i18n',
      '@nuxt/image',
      '@nuxtjs/critters',
      'nuxt-delay-hydration',
      'nuxt-viewport',
  ],

  i18n: {
      locales: ['en', 'pl'],
      defaultLocale: 'en',
      dynamicRouteParams: true,
      customRoutes: 'config', // disable custom route with page components
      pages: {
          'collections/index': {
              pl: '/kolekcje'
          },
          'collection/[slug]': {
              pl: '/kolekcja/[slug]'
          },
          'store-finder/index': {
              pl: '/wyszukiwarka-sklepow'
          },
          'store-finder/[country]': {
              pl: '/wyszukiwarka-sklepow/[country]'
          },


          'news/index': {
              pl: '/aktualnosci'
          },
          'news/[slug]': {
              pl: '/aktualnosci/[slug]'
          },

          'contact/index': {
              pl: '/kontakt'
          },

          'press-about-us/index': {
              pl: '/prasa'
          },

          'warsaw': {
              pl: '/warszawa'
          },


          'trunk-shows/index': {
              pl: '/pokazy'
          },
          'trunk-shows/[slug]': {
              pl: '/pokazy/[slug]'
          },

      },
      detectBrowserLanguage: {
          useCookie: false,
          cookieKey: 'i18n_redirected',
          redirectOn: 'root' // recommended
      }
      // debug: true

  },

  build: {
      analyze: true,
  },

  app: {
      pageTransition: { name: 'page', mode: 'out-in' }
  },

  vite: {
      plugins: [ graphql() ],
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: '@import "@/assets/style/global.scss";',
              },
          },
      },
  },

  strapi: {
      url: process.env.STRAPI_URL || 'http://localhost:1337',
      GTM: process.env.GTM,
      GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
      SEARCH_URL: process.env.SEARCH_URL,
      MODE: process.env.MODE,
      // url:  'https://millanova-backend-iwjo4.ondigitalocean.app'
  },

  runtimeConfig: {
      MODE: process.env.MODE,
      STRAPI_URL: process.env.STRAPI_URL,
      SEARCH_URL: process.env.SEARCH_URL,
      MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
      GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
      STRAPI_PREVIEW_SECRET: process.env.STRAPI_PREVIEW_SECRET,
      GTM: process.env.GTM,
      ABSTRACT_API: process.env.ABSTRACT_API,
      ADMIN_URL: process.env.STRAPI_URL || 'http://localhost:1337',
      PINECONE_KEY: process.env.PINECONE_KEY,
      public: {
          posthogPublicKey: process.env.POSTHOG_KEY,
          posthogHost: 'https://us.i.posthog.com'
      }
  },

  image: {
      domains: ['nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com', 'millanova.nyc3.cdn.digitaloceanspaces.com', 'localhost', 'img.youtube.com', 'i.vimeocdn.com'],
      // staticFilename: '[publicPath]/img',
      screens: {
          default: 320,
          xxs: 480,
          xs: 576,
          sm: 768,
          md: 996,
          lg: 1200,
          xl: 1367,
          xxl: 1600,
          '4k': 1921
      },
      alias: {
          youtube: 'https://img.youtube.com',
          vimeo: 'https://i.vimeocdn.com',
      }
  },

  delayHydration: { 
      mode: 'init',
      // enables nuxt-delay-hydration in dev mode for testing  
      debug: process.env.NODE_ENV === 'development'
    },

  viewport: {
      breakpoints: {
      default: 320,
      xxs: 480,
      xs: 576,
      sm: 768,
      md: 996,
      lg: 1200,
      xl: 1367,
      xxl: 1600,
      '4k': 1921
  }},

  devtools: {
    enabled: true
  }
})
