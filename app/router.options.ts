import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
    routes: (_routes) => [
        ..._routes,
        {
            name: 'store-finder',
            path: '/store-finder/:country?',
            component: () => import('~/components/StoreFinderPage.vue').then(r => r.default || r),
        }
    ],
}
