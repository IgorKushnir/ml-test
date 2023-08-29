async function getCountry(slug, lang) {

    const graphql = useStrapiGraphQL()

    // console.log({slug});

    const response = graphql(`
    query storeFinder{
     storeFinder (slug: "${await slug}" locale: "${lang}") {
            data {
              attributes {
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
        transform: (d) => {
            const countries = d.data['storeFinders'].data.map(e => {
                return {value: e.attributes.country, flag: e.attributes.country_code, slug: e.attributes.slug}
            })
            let priority = ['ukraine', 'australia', 'italy', 'united-states', 'united-kingdom', 'turkey']
            function getCountryIndex(slug) {
                return countries.findIndex(c => c.slug === slug)
            }
            let excluded = countries.filter(c => !priority.includes(c.slug))

            priority = priority.map(e => getCountryIndex(e) !== -1 ? countries[getCountryIndex(e)] : null)
            priority = priority.filter(c => c !== null)


            return [...priority, ...excluded]
        }
    })


    // return (e) => {
    //     e.call()
    //     return data
    // }
    return data;
}

export {getCountry, getListOfCountries}
