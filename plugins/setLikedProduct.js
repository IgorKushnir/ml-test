export default defineNuxtPlugin(() => {

    return {
        provide: {
            toggleLikeProduct: (id) => {
                if (!localStorage['liked']) localStorage['liked'] = '[]';
                let store = localStorage['liked'];

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
                    localStorage['liked'] = JSON.stringify(jsonStore);
                }



            },
            getLikedProducts: () => {
                if (!localStorage['liked']) localStorage['liked'] = '[]';
                let store = localStorage['liked'];

                return JSON.parse(store)
            }
        }
    }
})
