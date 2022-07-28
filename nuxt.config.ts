import {defineNuxtConfig} from 'nuxt'

export default defineNuxtConfig({
    css: [
        '@/assets/style/main.scss',
        // '@/assets/style/global.scss',
    ],
    buildModules: [
        // 'nuxt-vite',
        '@nuxtjs/strapi',
    ],


    build: {


    },
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
        // SEARCH_URL: process.env.SEARCH_URL || 'http://167.172.227.234',
    }
})


