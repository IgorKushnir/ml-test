import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
    console.log('Google analytics: G-XJ36V6PWXJ');
    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: 'G-XJ36V6PWXJ'
        }
    })
})
