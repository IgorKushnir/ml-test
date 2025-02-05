import seo from './misc/seo'
import locals from './misc/locals'
import content from './misc/content'

export default async function (lang, publicationState = "LIVE") {
    const graphql = useStrapiGraphQL()
    const collection = 'flagship';
    // ${locals()}

    const extra_blocks = `
          ...on ComponentContentIframe {
            __typename
            link
          }
            `

    const response = graphql(`
    query Flagship{
  flagship(locale: "${lang}" publicationState: ${publicationState}) {
    data {
      attributes {
      ${seo()}
        title
        sub_header
        description
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
                ${content(extra_blocks)}

        success
        contact_title
        contact_address
        contact_address_url
        contact_phone
        social {
          title
          url
          icon
        }
        servises {
          title
          service_id
          publish
        }
        specials {
            name
            from
            to
        }
      }
    }
  }
}
`);



    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => d?.data[collection]?.data ? d?.data[collection]?.data.attributes : null,
    })
    return { data, pending, refresh, error };
}
