import { defineNuxtPlugin } from '#app'
import axios from 'axios';
import getDressRedirects from "~/api/getDressRedirects";

import {transformDressRedirectJson} from "~/app/dress-redirect/dress-redirects";

const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})
export default defineNuxtPlugin(async (nuxtApp) => {
    // const config = useRuntimeConfig();
    // let redirects

    // const response = await axios.get(config.public.strapi.url + "/api/types?populate=productLandingsRedirects&locale=all")


    const { data, pending, refresh, error } = await getDressRedirects()
    // console.log(data.value.data.types);
    // const redirects = transformDressRedirectJson(data.value.data.types)
    // const redirects = []

    // console.log(data.value);
    // console.log(redirects);
    const router = useRouter()
    data.value.forEach(newRoute => {
        router.addRoute({
            name: newRoute.name,
            path: newRoute.to,
            component: () => Discover,
            meta: {
                slug: newRoute.meta.slug,
                title:newRoute.meta.title,
                description: newRoute.meta.description,
                h1: newRoute.meta.h1,
                query: newRoute.meta.query,
                seoText: newRoute.meta.seoText
            }
        })
    })


    // fs.readFile('app/dress-redirect/dress-redirects.json', 'utf-8', function (err,data) {
    //     if (err) return console.log(err);
    //     console.log(JSON.parse(data));
    // });

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
function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
