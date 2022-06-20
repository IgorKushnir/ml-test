import Swiper, { Navigation, Scrollbar, FreeMode} from 'swiper';
export default defineNuxtPlugin(() => {

    return {
        ssr: true,
        provide: {
            swiper: () => {
                return Swiper

            },
            Navigation: () => {
                return Navigation

            },
            Scrollbar: () => {
                return Scrollbar

            },
            FreeMode: () => {
                return FreeMode

            }
        }
    }
})
