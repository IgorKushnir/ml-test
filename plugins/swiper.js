
import Swiper from 'swiper'


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(new Swiper)
})
