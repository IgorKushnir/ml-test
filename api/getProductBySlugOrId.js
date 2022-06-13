export default async function (slugOrId) {
    const graphql = useStrapiGraphQL()
    let collection = 'product';

    let response;

    if (isNaN(slugOrId)) {
        collection = collection + 's'

        response = graphql(`
query Product{
  products(
    filters: {
      slug: {
        eq: "${slugOrId}"
      }
    }
  ) {
    data {
      id
      attributes {
        title
        description
        cover_3x4 {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
      }
    }
  }
}
`);
    } else {
        response = graphql(`
query Product{
  product(id: "${slugOrId}") {
    data {
      id
      attributes {
        title
        description
        cover_3x4 {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
      }
    }
  }
}
`);
    }


    const {data, pending, refresh, error} = await useAsyncData('p_data_' + collection, () => response, {
        transform: (d) => {
            if (isNaN(slugOrId)) {
                if (d.data[collection].data[0]) {
                    d.data[collection].data[0].attributes.id = d.data[collection].data[0].id
                    return d.data[collection].data[0].attributes
                }
            } else {
                if (d.data[collection].data !== null) {
                    d.data[collection].data.attributes.id = d.data[collection].data.id
                    return d.data[collection].data.attributes
                }
            }
            return null
        },
    })

    return {data, pending, refresh, error};
}
