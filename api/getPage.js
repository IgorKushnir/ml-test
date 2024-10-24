import content from './misc/content'
import seo from './misc/seo'
import locals from './misc/locals'

export default async function (slug, lang, publicationState = "LIVE") {
    const graphql = useStrapiGraphQL()
    const collection = 'pages';

    const response = graphql(`
query Page{
  pages (
  publicationState: ${publicationState}
  locale: "${lang}"
    filters: {
      slug: {
        eq: "${slug}"
      }
    }
  ) {
    data {
      attributes {
      ${seo()}
      ${locals()}
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
        }
                ${content()}

      }
    }
  }
}
`);


    // const currentLangPages = useCurrentLangPages();
    // currentLangPages.value = {
    //     // [locale]: {slug: route.slug}
    //     en: {slug: 'company'},
    //     pl: {slug: 'company-pl'}
    // }
    // console.log(currentLangPages.value);

    // console.log(route);

    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data[0] ? d.data[collection].data[0].attributes : null,
    })
    return { data, pending, refresh, error };
}
