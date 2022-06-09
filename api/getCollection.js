export default async function (slug, lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'collections';

    const response = graphql(`
query Collection{
  collections (
    locale: "${lang}"
    filters: {
      slug: {
        eq: "${slug}"
      }
    }
  ) {
    data {
      attributes {
        title
        line {
          data {
            attributes {
              title
            }
          }
        }
        cover_4x3 {
          data {
            attributes {
              formats
            }
          }
        }
        description
        
        products(
          pagination: {limit: -1}
          sort: "title"
          filters: {
            type: {
              slug: {
                eq: "dress"
              }
            }
          }
        ) {
          data {
            attributes {
              title
              slug
              cover_3x4 {
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
    }
  }
}
`);

    const { data, pending, refresh, error } = await useAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data[0] ? d.data[collection].data[0].attributes : null,
    })

    return { data, pending, refresh, error };
}
