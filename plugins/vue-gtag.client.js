import VueGtag from 'vue-gtag-next'

// export default defineNuxtPlugin((nuxtApp) => {
//     console.log('Google analytics: G-XJ36V6PWXJ');
//     nuxtApp.vueApp.use(VueGtag, {
//         property: {
//             id: 'G-XJ36V6PWXJ'
//         }
//     })
//
//
// })
export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const id = config.public.strapi.GOOGLE_ANALYTICS;

    if (!id) return
    // console.log('Google analytics: ' + id);

    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: id
        },
        enabled: true,
        pageTrackerScreenviewEnabled: true,
    }, nuxtApp.vueApp.router);
});
