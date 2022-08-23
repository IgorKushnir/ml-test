import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
        // Set minimum height of body
        document.getElementById('body').style.minHeight = savedPosition?.top ?  savedPosition?.top + window.innerHeight + 'px' : 0

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    left: savedPosition?.left || 0,
                    top: savedPosition?.top || 0,
                    // behavior: 'smooth'
                })
            }, 500)
        })
    }
})
