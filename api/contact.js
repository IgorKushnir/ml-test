export default async function (lang) {

    const graphql = useStrapiGraphQL()


    const contact = `
    contactUs(locale:"${lang}") {
         data {
              attributes {
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
                entry {
                  title
                  slug
                  form {
                    title
                    type
                    required
                    size
                  }
                  emails {
                    email
                  }
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
