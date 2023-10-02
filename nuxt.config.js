import {defineNuxtConfig} from 'nuxt/config'
import graphql from '@rollup/plugin-graphql';

export default defineNuxtConfig({
    ssr: true,
    css: [
        '@/assets/style/main.scss',
    ],
    modules: [
        '@nuxtjs/strapi',
        '@nuxtjs/i18n'
    ],
    i18n: {
        locales: ['en', 'pl'],
        defaultLocale: 'en',
        // vueI18n: {
        //     fallbackLocale: 'en'
        // },
        // detectBrowserLanguage: {
        //     useCookie: true,
        //     // cookieKey: 'i18n_redirected',
        // },
    },
    build: {

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
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS
        // url:  'https://millanova-backend-iwjo4.ondigitalocean.app'
    },

    runtimeConfig: {
        MODE: process.env.MODE,
        STRAPI_URL: process.env.STRAPI_URL,
        SEARCH_URL: process.env.SEARCH_URL || 'http://localhost:7700',
        MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
        STRAPI_PREVIEW_SECRET: process.env.STRAPI_PREVIEW_SECRET,
        GTM: process.env.GTM,
        ABSTRACT_API: process.env.ABSTRACT_API,
        ADMIN_URL: process.env.STRAPI_URL || 'http://localhost:1337',
        // SEARCH_URL: process.env.SEARCH_URL || 'http://167.172.227.234',
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
    }
})

