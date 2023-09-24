
function transformDressRedirectJson(response) {
    let _redirects = []
    if (!response) return _redirects

    response.data.forEach((types) => {
        const slug = types.attributes.slug
        // const lang = types.attributes.locale
        types.attributes.productLandingsRedirects.forEach((meta) => {
            if (meta.enable) {
                _redirects.push({
                    name: generateRandomID(),
                    from: meta.from,
                    to: meta.to,
                    meta: {
                        slug: slug,
                        title: meta.title,
                        description: meta.description,
                        h1: meta.h1,
                        // query: meta.query,
                        query: convertPathToQueryObject(meta.from),
                        seoText: meta.seoText
                    }
                })
            }
        })
    })
    return _redirects
}


function convertPathToQueryObject(path) {
    // Create a new URL object
    const url = new URL(path, 'http://dummy.com'); // The domain is a dummy since we only care about the path and search params

    // Get the search parameters from the URL
    const params = new URLSearchParams(url.search);

    // Convert the search parameters to an object
    const queryObject = {};
    for (const [key, value] of params.entries()) {
        queryObject[key] = value;
    }
    return queryObject;
}
function generateRandomID(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}


export {transformDressRedirectJson}
