import {usePreviousRoute} from "~/composables/states";
export default defineNuxtRouteMiddleware((to, from) => {

    usePreviousRoute().value = from.name;



})

