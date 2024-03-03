 async function getDressRedirects(lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'dressRedirects';
     // console.log({lang});

     const response = graphql(`
query Landings{
  types (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ) {
    data {
      attributes {
        slug
        locale
        productLandingsRedirects (
          pagination: {
            limit: -1
          }){
          name
          from
          to
          title
          h1
          description
          enable
          seoText
          locales(locale: "${lang}")
        }
      }
    }
  }
}
`);

     return await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => {
            return transformDressRedirectJson(d.data.types)
        },
    })
}



function transformDressRedirectJson(response) {
    let _redirects = []
    if (!response) return _redirects

    response.data.forEach((types) => {
        const slug = types.attributes.slug
        const locale = types.attributes.locale
        types.attributes.productLandingsRedirects.forEach((meta) => {
            if (meta.enable) {
                let locales = meta.locales.map(locale => {
                    if (locale.slug !== null && locale.slug.startsWith('/')) locale.slug = locale.slug.replace('/', '')
                    if (locale.slug !== null && locale.slug.startsWith(locale.locale+'/')) locale.slug = locale.slug.replace(locale.locale+'/', '')
                    // return {attributes: locale}
                    return locale
                })
                if (locales.length === 0) locales = null

                _redirects.push({
                    name: meta.to,
                    from: meta.from,
                    to: meta.to,
                    locale,
                    meta: {
                        slug: slug,
                        title: meta.title,
                        description: meta.description,
                        h1: meta.h1,
                        // query: meta.query,
                        query: convertPathToQueryObject(meta.from),
                        seoText: meta.seoText,
                        locales
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

export {getDressRedirects, generateRandomID, convertPathToQueryObject}
