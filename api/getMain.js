import content from './misc/content'
import seo from './misc/seo'

export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'main';

    const extra_blocks = `
    ...on ComponentContentSilhouettes {
    __typename
            title
            text
            silhouettes {
              data {
                attributes {
                  title
                  slug
                }
              }
            }
          }
    `;
    const response = graphql(`
query Main{
  main (
  locale: "${lang}"
  ) {
    data {
      attributes {
      ${seo()}
        banner {
          title
          text
          button_text
          button_link
          button
          cover_4x3 {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                  }
                }
              }
          cover_3x4 {
            data {
              attributes {
                mime
                formats
                url
                placeholder
                width
                height
              }
            }
          }
          poster_3x4 {
            data {
              attributes {
                mime
                formats
                url
                placeholder
                width
                height
              }
            }
          }
          poster_4x3 {
            data {
              attributes {
                mime
                formats
                url
                placeholder
                width
                height
              }
            }
          }
        }
                ${content(extra_blocks)}

      }
    }
  }
}
`);


    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data,
    })
    return { data, pending, refresh, error };
}
