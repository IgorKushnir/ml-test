import {usePreviousRoute} from "~/composables/states";


export default defineNuxtRouteMiddleware((to, from) => {
    usePreviousRoute().value = from.name; // ???
})

function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
