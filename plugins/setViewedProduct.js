export default defineNuxtPlugin(() => {

    return {
        provide: {
            setViewedProduct: (id) => {
                if (!localStorage['viewedProducts']) localStorage['viewedProducts'] = '[]';
                let store = localStorage['viewedProducts'];

                if (!id) return

                let jsonStore = JSON.parse(store)

                // Find existing product and remove
                const existingIndex = jsonStore.findIndex(p => p === id)
                if (existingIndex !== -1) {
                    jsonStore.splice(existingIndex, 1)
                }

                jsonStore.unshift(id)


                // Reduce array
                if (jsonStore.length > 20) jsonStore.pop()

                localStorage['viewedProducts'] = JSON.stringify(jsonStore);

            },
            getViewedProduct: () => {
                if (!localStorage['viewedProducts']) localStorage['viewedProducts'] = '[]';
                let store = localStorage['viewedProducts'];

                return JSON.parse(store)
            }
        }
    }
})
