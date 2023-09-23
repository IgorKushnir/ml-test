import axios from "axios";

async function getRedirects() {
    // const url = process.env.STRAPI_URL;
    const url = 'http://localhost:1337';
    // const url = 'https://admin.millanova.com';

    // console.log(url);
    try {
        const response = await axios.get(url+"/api/types?populate=productLandingsRedirects&locale=all")
        if (response.status === 200) {
            let _redirects = []
            response.data.data.forEach((types) => {
                const slug = types.attributes.slug
                // const lang = types.attributes.locale
                types.attributes.productLandingsRedirects.forEach((meta) => {
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
                })
            })
            // console.log(_redirects);
            return _redirects

        }
    } catch (e) {
        console.error('Error to call: /api/types?populate=productLandingsRedirects&locale=all?');
        return []
    }
}
function transformDressRedirectJson(response) {
    let _redirects = []
    if (!response) return _redirects

    response.data.forEach((types) => {
        const slug = types.attributes.slug
        // const lang = types.attributes.locale
        types.attributes.productLandingsRedirects.forEach((meta) => {
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

export {getRedirects, transformDressRedirectJson}
