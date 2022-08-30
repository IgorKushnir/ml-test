import {defineNuxtConfig} from 'nuxt'
import graphql from '@rollup/plugin-graphql';

export default defineNuxtConfig({
    css: [
        '@/assets/style/main.scss',
    ],
    buildModules: [
        // 'nuxt-vite',
        '@nuxtjs/strapi',
    ],
    modules: [
        // '@nuxt/image-edge',
    ],

    build: {

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



    // package.json - "nuxt-vite": "^0.3.5"
    // vite: {
    //     build: {
    //         rollupOptions: {
    //             external: [
    //                 'swiper/vue',
    //                 'vue-gtag-next',
    //                 'vue',
    //             ]
    //         }
    //     },
    //     css: {
    //         preprocessorOptions: {
    //             scss: {
    //                 additionalData: '@import "@/assets/style/global.scss";',
    //             },
    //         },
    //     },
    // },

    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337',
        // url:  'https://millanova-backend-iwjo4.ondigitalocean.app'
    },

    publicRuntimeConfig: {
        MODE: process.env.MODE,
        STRAPI_URL: process.env.STRAPI_URL,
        SEARCH_URL: process.env.SEARCH_URL || 'http://localhost:7700',
        MEILISEARCH_API_KEY: process.env.MEILISEARCH_API_KEY,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
        STRAPI_PREVIEW_SECRET: process.env.STRAPI_PREVIEW_SECRET,
        // SEARCH_URL: process.env.SEARCH_URL || 'http://167.172.227.234',
    },

    image: {
        domains: ['nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com', 'millanova.nyc3.cdn.digitaloceanspaces.com', 'localhost'],
        // staticFilename: '[publicPath]/img',
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
            '2xl': 1536
        },
    }
})


