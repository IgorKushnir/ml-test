import { defineNuxtPlugin } from '#app'
export default defineNuxtPlugin((nuxtApp) => {

})
// export default defineNuxtPlugin((nuxtApp) => {
//
//     // nuxtApp.hook('page:start', () => {
//     //     console.log("Page finished loading..");
//     // })
//     // console.log(nuxtApp.$router.options.scrollBehavior);
//     nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
//         document.getElementById('body').style.minHeight = savedPosition?.top ?  savedPosition?.top + window.innerHeight *2 + 'px' : 0
//
//         // var body = document.body,
//         //     html = document.documentElement;
//         //
//         // var height = Math.max( body.scrollHeight, body.offsetHeight,
//         //     html.clientHeight, html.scrollHeight, html.offsetHeight );
//         //
//         // console.log(height - savedPosition?.top);
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve({
//                     left: savedPosition?.left || 0,
//                     top: savedPosition?.top || 0,
//                     // behavior: 'smooth'
//                 })
//             }, 500)
//         })
//     }
// })
//
//
//
