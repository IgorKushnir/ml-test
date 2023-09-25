import { defineNuxtPlugin } from '#app'
import getDressRedirects from "~/api/getDressRedirects";


const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})
export default defineNuxtPlugin(async (nuxtApp) => {

    const { data, pending, refresh, error } = await getDressRedirects()
    if (error.value) return

    const router = useRouter()
    let routesFrom = []


    data.value.forEach(newRoute => {
        routesFrom.push(newRoute.from)

        router.addRoute({
            name: newRoute.name,
            path: newRoute.to,
            component: () => Discover,
            meta: setMeta(newRoute)
        })
    })

    router.afterEach((route) => {

        const fullPath = route.fullPath;
        if (routesFrom.includes(fullPath)) {
            const index = data.value.findIndex(d => d.from === fullPath)
            if (is_server()) {
                navigateTo(data.value[index].to, {
                    redirectCode: 301
                })
            } else {
                route.meta = setMeta(data.value[index])
                // route.meta.pageTransition = false;
                window.history.replaceState('', '', data.value[index].to)
            }
        }
    })
    // console.log(router);
    //
    // router.meta = {}
    // router.meta.pageTransition = false

    // const app = useNuxtApp()
    // console.log(app);

})
function setMeta(newRoute) {
    return {
        slug: newRoute.meta.slug,
        title:newRoute.meta.title,
        description: newRoute.meta.description,
        h1: newRoute.meta.h1,
        query: newRoute.meta.query,
        seoText: newRoute.meta.seoText
    }
}
function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
