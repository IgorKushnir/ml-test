export default defineNuxtPlugin(() => {

    return {
        provide: {
            setViewedProduct: (id, slug) => {
                if (!localStorage['viewed']) localStorage['viewed'] = '[]';
                let store = localStorage['viewed'];

                if (!id || !slug) return

                let jsonStore = JSON.parse(store)

                // Find existing product and remove
                const existingIndex = jsonStore.findIndex(p => p.id === id)
                if (existingIndex !== -1) {
                    jsonStore.splice(existingIndex, 1)
                }

                jsonStore.unshift({
                    id: id,
                    slug: slug
                })


                // Reduce array
                if (jsonStore.length > 20) jsonStore.pop()

                localStorage['viewed'] = JSON.stringify(jsonStore);

            },
            getViewedProduct: () => {
                if (!localStorage['viewed']) localStorage['viewed'] = '[]';
                let store = localStorage['viewed'];

                return JSON.parse(store)
            }
        }
    }
})
