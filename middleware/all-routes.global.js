import {usePreviousRoute} from "~/composables/states";

export default defineNuxtRouteMiddleware((to, from) => {
    // console.log('running global middleware', to, from)
    usePreviousRoute().value = from;

})
