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
        ) {
          name
          store (
          pagination: {
            limit: -1
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
          }
        }
      }
    }
  }
}
    `);

    const { data, pending, refresh, error } = await useAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data,
    })

    return { data, pending, refresh, error };
}
