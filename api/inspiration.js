import content from './misc/content'

async function getCategories(lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'categories';

    const response = graphql(`
    query Categories{
  categories(
    locale: "${lang}"
    sort: "order"
    pagination: {
      limit: -1
    }
  ) {
    data {
      attributes {
        title
        slug
        postLength
      }
    }
  }
}
    `);

    const {data, pending, refresh, error} = await useLazyAsyncData('data_' + collection, () => response, {
        transform: (d) => d.data[collection].data.filter(f => f.attributes.postLength > 0)
    })

    return {data, pending, refresh, error};
}

function getInspirations(lang, category, page = 1, pageSize = 8) {
    const graphql = useStrapiGraphQL()
    const collection = 'inspirations';

    let filters = ''
     console.log(category);
     if (category != null && category !== 'all') {
        filters = `
        filters: {
          categories: {
            slug: {
              eq: "${category}"
            }
          }
        }`
    }
    const response = graphql(`
    query Inspirations{
  inspirations (
    locale: "${lang}"
    ${filters}
        pagination: {
        page: ${page}
        pageSize: ${pageSize}
      }
      sort: "created:desc"
  ){
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
    data {
      attributes {
        title
        slug
        cover_3x1 {
          data {
            attributes {
              formats
              url
              placeholder
            }
          }
        }
			  cover_1x1 {
          data {
            attributes {
              formats
              url
              placeholder
            }
          }
        }
      }
    }
  }
}
    `);


    return response
    // return await useLazyAsyncData('data_' + collection, () => response, {
    //     transform: (d) => {
    //         console.log(category);
    //         return d.data[collection]
    //     }
    // })
}

async function getInspiration(slug, lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'inspiration';

    const response = graphql(`
    query Inspiration{
  inspiration (
    locale: "${lang}"
    slug: "${slug}"
    
  ){
    data {
      attributes {
        title
        slug
        created
        ${content()}
        cover_3x1 {
          data {
            attributes {
              formats
              url
              placeholder
            }
          }
        }
			  cover_1x1 {
          data {
            attributes {
              formats
              url
              placeholder
            }
          }
        }
      }
    }
  }
}
    `);

    const {data, pending, refresh, error} = await useLazyAsyncData('data_' + collection, () => response, {
        transform: (d) => d.data[collection].data
    })

    return {data, pending, refresh, error};
}

export { getCategories, getInspirations, getInspiration };
