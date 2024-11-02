export default defineNuxtPlugin((nuxt) => {

    return {
        provide: {
            toggleLikeProduct: (id) => {
                const locale = nuxt.$i18n.locale.value
                let storageName = 'likedProducts'
                storageName = locale === 'en' ? storageName : storageName+'_'+locale

                if (!localStorage[storageName]) localStorage[storageName] = '[]';
                let store = localStorage[storageName];

                if (!id) return

                let jsonStore = JSON.parse(store)


                // Find existing product and remove
                const existingIndex = jsonStore.findIndex(p => p === id)
                if (existingIndex !== -1) {
                    jsonStore.splice(existingIndex, 1)
                    save();
                    return false;
                } else {
                    jsonStore.unshift(id);
                    save();
                    return true;
                }

                function save() {
                    const locale = nuxt.$i18n.locale.value
                    let storageName = 'likedProducts'
                    storageName = locale === 'en' ? storageName : storageName+'_'+locale

                    localStorage[storageName] = JSON.stringify(jsonStore);

                    // Set counter
                    const likeCounter = useFavCount()
                    likeCounter.value = jsonStore?.length
                }



            },
            getLikedProducts: () => {
                const locale = nuxt.$i18n.locale.value
                let storageName = 'likedProducts'
                storageName = locale === 'en' ? storageName : storageName+'_'+locale

                if (!localStorage[storageName]) localStorage[storageName] = '[]';
                let store = localStorage[storageName];

                return JSON.parse(store)
            }
        }
    }
})
