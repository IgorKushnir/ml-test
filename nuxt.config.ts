import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({

    css: [
        '@/assets/style/main.scss',
    ],
    buildModules: [
        'nuxt-vite',
        "@nuxt3-graphql/urql",
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

    urql: {
        url: "http://localhost:1337/graphql/"
    },

    publicRuntimeConfig: {
        API_CDN_URL: process.env.API_CDN_URL
    },
})


