import type {RouterConfig} from '@nuxt/schema'
// import {getRedirects} from "~/dress-redirects";


// const redirects:any = await getRedirects();
import rowRedirects from '~/misk/dress-redirects.json' assert {type: 'json'};
import {transformDressRedirectJson} from "~/dress-redirects";

const redirects = transformDressRedirectJson(rowRedirects)
// console.log({redirects});

const component = import('~/components/Discover.vue').then(r => {
    return r.default || r
})

// Dress redirects. Check all-routes.global.js as well
const r = redirects.map((redirect:any) => {
    return {
        name: redirect.name,
        path: redirect.to,
        component: () => component,
        meta: redirect.meta
    }
})

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
    routes: (_routes) => {
        // console.log('1',redirects);
        _routes.forEach(route => {
            if (route.name.startsWith('slug')) { // slug name means Discovery or Page
                route.meta.dressRedirrects = redirects;
            }
        })
        return [
            ..._routes,
            ...r,
        ]

    },
}


function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
