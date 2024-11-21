import seo from './misc/seo'

async function getCountry(slug, lang) {

    const graphql = useStrapiGraphQL()

    // console.log({slug});

    const response = graphql(`
    query storeFinder{
     storeFinder (slug: "${await slug}" locale: "${lang}") {
            data {
              attributes {
              ${seo()}
                country
                slug
                country_code
                city (
                  pagination: {
                    limit: -1
                  }
                  sort: "name"
                ) {
                  name
                  state
                  store (
                      pagination: {
                        limit: -1
                      }
                      filters: {
                          publish: {
                            eq: true
                          }
                        }
                ){
                    title
                    description
                    address
                    phone
                    publish
                    website
                    lat
                    lng
                    premium
                    instagram
                    email
                    alternative_appointment_button_url
                    alternative_appointment_button_text
                    badge
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
                    lines {
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
            }
          }
          
        }
    `);


    return response
}
async function getBanner(lang) {

    const graphql = useStrapiGraphQL()

    // console.log({slug});

    const response = graphql(`
    query flagship{

  flagship(locale: "${lang}") {
    data {
      attributes {
        storefinder_banner {
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
      }
    }
}
        }
    `);


    const {data, pending, refresh, error} = await useAsyncData('data_storefinder_banner', () => response, {
        transform: (d) => {
            return d.data.flagship.data ? d.data.flagship.data.attributes.storefinder_banner : null
        }
    })

    return data;
}
async function getListOfCountries(lang) {
    const graphql = useStrapiGraphQL()
    const response = graphql(`
    query Store{
  storeFinders(
    locale: "${lang}"
    sort: "country"
    pagination: {
      limit: -1,
    }
  ) {
    data {
      attributes {
        country
        country_code
        slug
      }
    }
  }
}
    `);
    const {data, pending, refresh, error} = await useAsyncData('data_list_of_countries', () => response, {
        transform: (d) => d.data['storeFinders'].data.map(e => {
                return {value: e.attributes.country, flag: e.attributes.country_code, slug: e.attributes.slug}
            })
    })


    // return (e) => {
    //     e.call()
    //     return data
    // }
    return data
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(data)
    //     }, 2000)
    // });
}

export {getCountry, getListOfCountries, getBanner}
