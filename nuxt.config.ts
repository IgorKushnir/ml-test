import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
    css: [
        '@/assets/style/main.scss',
    ],
    buildModules: [
        'nuxt-vite',
        '@nuxtjs/strapi'
    ],
    vite: {
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
    },

    publicRuntimeConfig: {
        MODE: process.env.MODE,
    },
})


