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
        show_promo
        cover_4x3 {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
        video {
          data {
            attributes {
              url
            }
          }
        }
        fact {
          title
          text
          logo
        }
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
       
      }
    }
  }
}
`);

    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data[0] ? d.data[collection].data[0].attributes : null,
    })

    return { data, pending, refresh, error };
}
