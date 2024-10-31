export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'storeFinders';

    const response = graphql(`
    query Store{
  storeFinders(
    locale: "${lang}"
    sort: "country"
    pagination: {
      limit: -1
    }
  ) {
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

    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => {
            let countries = d.data[collection].data

            // Remove cities with stores length 0
            let c = countries.map(country => {

                let cities = []
                country.attributes.city?.forEach(city => {
                    if (city.store?.length > 0) {
                        city.store?.forEach(c => {
                            c.country_code = country.attributes.country_code
                            c.city = city.name
                        })
                        cities.push(city)
                    }
                })
                country.attributes.city = cities
                return country
            })
            // countries.filter
            let priority = ['ukraine', 'australia', 'italy', 'united-states', 'united-kingdom', 'turkey']
            function getCountryIndex(slug) {
                return countries.findIndex(c => c.attributes.slug === slug)
            }

            let excluded = countries.filter(c => !priority.includes(c.attributes.slug))


            priority = priority.map(e => getCountryIndex(e) !== -1 ? countries[getCountryIndex(e)] : null)
            priority = priority.filter(c => c !== null)



            return [...priority, ...excluded]

        },
    })

    return { data, pending, refresh, error };

}
