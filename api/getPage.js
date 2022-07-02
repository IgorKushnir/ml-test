import content from './misc/content'

export default async function (slug, lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'pages';

    const response = graphql(`
query Page{
  pages (
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
        text
        sub_header
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
          
        }
                ${content()}

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
