export default defineNuxtPlugin((nuxt) => {

    return {
        provide: {
            setViewedProduct: (id) => {
                const locale = nuxt.$i18n.locale.value
                let storageName = 'viewedProducts'
                storageName = locale === 'en' ? storageName : storageName+'_'+locale

                if (!localStorage[storageName]) localStorage[storageName] = '[]';
                let store = localStorage[storageName];

                if (!id) return

                let jsonStore = JSON.parse(store)

                // Find existing product and remove
                const existingIndex = jsonStore.findIndex(p => p === id)
                if (existingIndex !== -1) {
                    jsonStore.splice(existingIndex, 1)
                }

                jsonStore.unshift(id)


                // Reduce array
                if (jsonStore?.length > 20) jsonStore.pop()

                localStorage[storageName] = JSON.stringify(jsonStore);

            },
            getViewedProduct: () => {
                const locale = nuxt.$i18n.locale.value
                let storageName = 'viewedProducts'
                storageName = locale === 'en' ? storageName : storageName+'_'+locale

                if (!localStorage[storageName]) localStorage[storageName] = '[]';
                let store = localStorage[storageName];

                return JSON.parse(store)
            }
        }
    }
})
