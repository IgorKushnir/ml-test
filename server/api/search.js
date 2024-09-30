// Search proxy
import {query} from "vue-gtag-next";

export default  defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const url = getRequestURL(event)
    const q = url.searchParams

    const query = q.get('q');
    const locale = q.get('locale');
    const SEARCH_URL = config.SEARCH_URL
    const MEILISEARCH_API_KEY = config.MEILISEARCH_API_KEY

    if (query) {
        return {
            products: await Search('product', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            collections: await Search('collection', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),

            color: await Search('color', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            fabric: await Search('fabric', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            // line: await Search('line', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            decoration: await Search('decoration', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            backneckline: await Search('backneckline', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            neckline: await Search('neckline', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            silhouette: await Search('silhouette', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            style: await Search('style', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
            other: await Search('other', query, locale, SEARCH_URL, MEILISEARCH_API_KEY),
        };
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
async function Search(index, query, locale, baseURL, key) {
    try {
        return {
            index,
            ...await $fetch(`indexes/${index}/search`, {
                baseURL,
                method: 'POST',
                headers: {
                    Authorization:
                        'Bearer ' + key,
                },
                body: {
                    "q": query,
                    "filter": "locale = " + (locale ?? 'en')
                }
            })
        }
    } catch (e) {
        console.error(e);
    }
}
