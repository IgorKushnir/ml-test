import content from './misc/content'

export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'main';

    const response = graphql(`
query Main{
  main (
  locale: "${lang}"
  ) {
    data {
      attributes {
        banner {
          title
          text
          button_text
          button_link
          button
          media {
            data {
              attributes {
                formats
                url
                placeholder
                mime 
              }
            }
          }
        }
                ${content()}

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
