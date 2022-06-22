async function getTrunkShows(lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'trunkShows';

    const response = graphql(`
    query TrunkShows{
  trunkShows (
    sort: "from"
    locale: "${lang}"
    pagination: {
      limit: -1
    }
  ) {
    data {
      attributes {
        title
        slug
        description
        from
        to
        country
        city
        apply_for
        cover_4x3 {
          data {
            attributes {
              url
              formats
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

async function getTrunkShow(slug, lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'trunkShow';

    const response = graphql(`
    query TrunkShow{
  trunkShow (
    slug: "${slug}"
    locale: "${lang}"
  ){
    data {
      attributes {
        slug
        title
        description
        from
        to
        phone
        website
        country
        city
        address
        apply_for
        content
        cover_4x3 {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
        offered {
          products {
            data {
              attributes {
                title
                slug
                cover_3x4 {
                  data {
                    attributes {
                      url
                      formats
                      placeholder
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`);

    const {data, pending, refresh, error} = await useLazyAsyncData('data_' + collection, () => response, {
        transform: (d) => d.data[collection].data
    })

    return {data, pending, refresh, error};
}


export { getTrunkShows, getTrunkShow }
