export default async function (slugOrId) {
    const graphql = useStrapiGraphQL()
    let collection = 'product';

    collection = collection + 's'
    let response = graphql(`
query Product{
  products(
    filters: {
      slug: {
        eq: "${slugOrId}"
      }
    }
  ) {
    data {
      id
      attributes {
      extra
      
        title
        description
        gallery {
          data {
            attributes {
              width
              height
              url
              formats
              placeholder
            }
          }
        }
        colors {
          data {
            attributes {
              title
              slug
            }
          }
        }
        collection {
          data {
            attributes {
              title
              slug
              line {
                data {
                  attributes {
                    title
                    slug
                  }
                }
              }
            }
          }
        }
        fact {
          title
          text
          logo
        }
        recommended {
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
}
`);


    const {data, pending, refresh, error} = await useAsyncData('p_data_' + collection, () => response, {
        transform: (d) => {
            if (isNaN(slugOrId)) {
                if (d.data[collection].data[0]) {
                    d.data[collection].data[0].attributes.id = d.data[collection].data[0].id
                    return d.data[collection].data[0].attributes
                }
            } else {
                if (d.data[collection].data !== null) {
                    d.data[collection].data.attributes.id = d.data[collection].data.id
                    return d.data[collection].data.attributes
                }
            }
            return null
        },
    })

    return {data, pending, refresh, error};
}
