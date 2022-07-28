import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
    console.log('Google analytics: G-XJ36V6PWXJ');
    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: 'G-XJ36V6PWXJ'
        }
    })


})
// export default defineNuxtPlugin((nuxtApp) => {
//         console.log('Google analytics: G-XJ36V6PWXJ - v2');
//
//     const getGDPR = localStorage.getItem('GDPR:accepted');
//     console.log({getGDPR});
//     nuxtApp.vueApp.use(VueGtag, {
//         property: {
//             id: 'G-XJ36V6PWXJ'
//         },
//         appName: 'Milla local',
//         // enabled: getGDPR === 'true',
//         enabled: true,
//         pageTrackerScreenviewEnabled: true
//     }, nuxtApp.vueApp.router);
// });
