import {usePreviousRoute} from "~/composables/states";

export default defineNuxtRouteMiddleware((to, from, next) => {
    usePreviousRoute().value = from.name; // ???



})

function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
