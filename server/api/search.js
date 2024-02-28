// Search proxy
export default  defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const url = getRequestURL(event)
    const q = url.searchParams

    if (q.get('q')) {
        return await $fetch(`indexes/product/search`, {
            baseURL: config.SEARCH_URL,
            method: 'POST',
            headers: {
                Authorization:
                    'Bearer ' + config.MEILISEARCH_API_KEY,
            },
            body: {
                "q": q.get('q'),
                "filter": "locale = "+(q.get('locale') ?? 'en')
            }
        });
    } else {
        return 'Search error'
    }

    // try {
    //     return await $fetch(`keys`, {
    //         baseURL: config.SEARCH_URL,
    ////         method: 'GET',
    //         method: 'PATCH',
    //         headers: {
    //             Authorization:
    //                 // 'Bearer ' + config.MEILISEARCH_API_KEY,
    //                 'Bearer ' + "aSampleMasterKey",
    //         },
    //         // body: {
    //         //     "q": q.get('q'),
    //         // }
    //     });
    // } catch (e) {
    //     console.log(e);
    //     return 'error'
    // }



})
