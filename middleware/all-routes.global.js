import {usePreviousRoute} from "~/composables/states";

export default defineNuxtRouteMiddleware((to, from, next) => {
    usePreviousRoute().value = from.name; // ???

    // console.log('---', window);

    //
    // if (to.fullPath === '/silhouette/a-line') {
    //
    //     console.log('1');
    //     // router.replace('/dress?silhouettes=a-line')
    //     // return navigateTo('/dress?silhouettes=a-line')
    //
    // }
    //


    // // This is last -------
    // if (to.fullPath === '/dress?silhouettes=a-line') {
    //     // return navigateTo('/silhouettes/a-line')
    //     if (is_server()) {
    //         return {
    //             path: '/dress/silhouettes/a-line',
    //         }
    //     }
    //
    //     setTimeout(() => {
    //         // console.log(to, to.meta);
    //         window.history.replaceState('', '', '/dress/silhouettes/a-line');
    //
    //     }, 10)
    // }

})

function is_server() {
    return ! (typeof window != 'undefined' && window.document);
}
