export default defineNuxtPlugin(async (nuxtApp) => {
    // nuxtApp.use



    const router = useRouter()
    router.afterEach((route) => {
        if (process.client) {
            pintrk('track', 'pagevisit', {
                event_id: 'eventId0001'
            });

        }
    })
})
