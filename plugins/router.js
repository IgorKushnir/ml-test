import { defineNuxtPlugin } from '#app'
import axios from 'axios';
import fs from 'fs';

import {transformDressRedirectJson} from "~/app/dress-redirect/dress-redirects";

const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})
export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig();
    // console.log(config);
    let redirects
    if(is_server()) {
        // console.log(process.cwd());
        if (process.env.NODE_ENV === 'development') {
            redirects = fs.readFileSync('public/dress-redirects.json','utf-8')
        } else {
            redirects = fs.readFileSync('.output/public/dress-redirects.json','utf-8')
        }
        redirects = JSON.parse(redirects)
    } else {
        const _redirects = await axios.get("/dress-redirects.json")
        redirects = _redirects.data;
    }

    redirects = transformDressRedirectJson(redirects)
    // console.log(redirects);


    const router = useRouter()

    redirects.forEach(newRoute => {
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
