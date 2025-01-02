import {defineNuxtConfig} from 'nuxt/config'
import graphql from '@rollup/plugin-graphql';

export default defineNuxtConfig({
  ssr: true,
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
      'nuxt-purgecss'
  ],

  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 };
    },
  },

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

          'inspiration/index': {
              pl: '/inspiracja'
          },
          'inspiration/[slug]': {
              pl: '/inspiracja/[slug]'
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
    //   extractCSS: true,
      terser: {
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }
  },

  app: {
      pageTransition: { name: 'page', mode: 'out-in' }
  },

  vite: {
      plugins: [ graphql() ],
      css: {
          preprocessorOptions: {
              scss: {
                additionalData: '@use "@/assets/style/global" as *;',
                api: 'modern-compiler'
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
      IP_INFO_KEY: process.env.IP_INFO_KEY,
      ADMIN_URL: process.env.STRAPI_URL || 'http://localhost:1337',
      PINECONE_KEY: process.env.PINECONE_KEY,
      public: {
          posthogPublicKey: process.env.POSTHOG_KEY,
          posthogHost: 'https://us.i.posthog.com',
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
      },
      formats: {
        webp: {
          quality: 80
        }
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
    enabled: false
  }
})