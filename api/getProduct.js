import seo from './misc/seo'
import locals from './misc/locals'


export default async function (slugOrId, extrudeIds = '', publicationState = "LIVE", lang = 'en') {

    if (extrudeIds) {
        extrudeIds = '(extrudeIds: ' + extrudeIds + ')'
    }
    const graphql = useStrapiGraphQL()
    let collection = 'product';

    collection = collection + 's'
    let response = graphql(`
query Product{
  products(
    publicationState: ${publicationState}
    filters: {
      slug: {
        eq: "${slugOrId}"
      }
    }
    locale: "${lang}"
  ) {
    data {
      id
      attributes {
      ${seo()}
            ${locals('product')}
      slug
      extra${extrudeIds}
        title
        discontinued
        description
        storeLink
        type {
            data {
                attributes {
                title
                slug
                }
            }
        }
        gallery {
          data {
            attributes {
              mime
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
        silhouettes {
          data {
            attributes {
              title
              slug
            }
          }
        }
        fabrics {
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
          ratio
          layout
          background_color
          text_color
        }
        properties {
          title
          level
          description
        }
        recommended {
          products(filters: {or: [{discontinued: {eq: null }} {discontinued: {eq: false }} ]}) {
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


    const {data, pending, refresh, error} = await useLazyAsyncData('p_data_' + collection, () => response, {
        transform: (d) => {
            let product;
            if (isNaN(slugOrId)) {
                if (d.data[collection].data[0]) {
                    d.data[collection].data[0].attributes.id = d.data[collection].data[0].id
                    product = d.data[collection].data[0].attributes
                }
            } else {
                if (d.data[collection].data !== null) {
                    d.data[collection].data.attributes.id = d.data[collection].data.id
                    product = d.data[collection].data.attributes
                }
            }
            return product
        },
    })
    // console.log(data, error);

    return {data, pending, refresh, error};
}
