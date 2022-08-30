export default defineNuxtPlugin(() => {

    return {
        provide: {
            toggleLikeProduct: (id) => {
                if (!localStorage['likedProducts']) localStorage['likedProducts'] = '[]';
                let store = localStorage['likedProducts'];

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
                    localStorage['likedProducts'] = JSON.stringify(jsonStore);

                    // Set counter
                    const likeCounter = useFavCount()
                    likeCounter.value = jsonStore.length
                }



            },
            getLikedProducts: () => {
                if (!localStorage['likedProducts']) localStorage['likedProducts'] = '[]';
                let store = localStorage['likedProducts'];

                return JSON.parse(store)
            }
        }
    }
})
