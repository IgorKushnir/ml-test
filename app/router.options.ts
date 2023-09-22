import type {RouterConfig} from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
    routes: (_routes) => {
        return [
            ..._routes,
            // // This is last -------
            // {
            //     name: 'dress',
            //     path: '/dress',
            //     component: () => import('~/components/Discover.vue').then(r => {
            //         return r.default || r
            //     }),
            //     props: {
            //         redirect:  {
            //             slug: 'dress',
            //             title: 'Milla Nova dress',
            //             description: 'Desa',
            //         }
            //     },
            // },
            // {
            //     name: 'discover',
            //     path: '/dress/silhouettes/a-line',
            //     // alias: '/silhouettes/a-line',
            //     component: () => import('~/components/Discover.vue').then(r => {
            //         return r.default || r
            //     }),
            //     // beforeEnter: (t,  f, next) => {
            //     //     console.log(t.path, t.fullPath);
            //     //     next()
            //     //     // next('/login')
            //     // },
            //     props: {
            //         redirect:  {
            //             slug: 'dress',
            //             title: 'A-line dress',
            //             description: 'Desa',
            //             filter: {
            //                 key: 'silhouettes',
            //                 values: ['a-line']
            //             }
            //         }
            //     },
            // },



            // {
            //     name: 'hello',
            //     path: '/dress',
            //     // path: '/uk/:type()/:slug()'
            //     // alias: '/dress?silhouettes=a-line',
            //     redirect: {
            //         // name: 'discover',
            //         path: '/',
            //         query: {
            //             'silhouettes' : 'a-line'
            //         },
            //     },
            // }
        ]
    },
}
