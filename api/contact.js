import seo from './misc/seo'

export default async function (lang) {

    const graphql = useStrapiGraphQL()


    const contact = `
    contactUs(locale:"${lang}") {
         data {
              attributes {
               ${seo()}
                title
                text
                cover_1x1 {
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
                entry (pagination: {limit: -1}) {
                  title
                  slug
                  form (pagination: {limit: -1}) {
                    title
                    type
                    required
                    size
                  }
                  emails (pagination: {limit: -1}) {
                    email
                  }
                  successful_message_sent_title
                  successful_message_sent_text
                  error_message_sent_title
                  error_message_sent_text
                }
              }
            }
        }
    `

    const response = graphql(`query Contact{ ${ contact } }`);


    return await useLazyAsyncData('data_contact', () => response, {
        transform: (d) => {
            return  d.data?.contactUs.data.attributes;
        },
    })
}
