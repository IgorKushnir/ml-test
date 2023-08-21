export default defineNuxtPlugin((nuxtApp) => {

    // if (!is_server()) {
    //     const router = useRouter();
    //     const route = useRoute();
    //     // console.log('router', router);
    //
    //     router.beforeEach((to, from) => {
    //         if (to.fullPath === '/silhouette/a-line') {
    //             console.log('1');
    //             router.replace('/dress?silhouettes=a-line')
    //         }
    //
    //     });
    //
    //     router.afterEach((to, from) => {
    //         if (to.fullPath === '/dress?silhouettes=a-line') {
    //             console.log('2');
    //             window.history.replaceState('', '', '/silhouette/a-line');
    //         }
    //     })
    // }
})


function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
