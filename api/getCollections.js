export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'lines';

    const response = graphql(`
query Collections{
    types(
        sort: "order"
        locale: "${lang}"
        pagination: {
          limit: -1
        }
      ) {
        data {
          attributes {
            title
            slug
          }
        }
  }
  
 lines (
     sort: "order" 
     locale: "${lang}"
     pagination: {
          limit: -1
        }
     ) {
        data {
          attributes {
            title
            slug
            order
            collections (
              sort: "order"
            ) {
              data {
                attributes {
                  title
                  slug
                  cover_3x4 {
                    data {
                      attributes {
                        url
                        placeholder
                        formats
                      }
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

    const { data, pending, refresh, error } = await useAsyncData('l_data_'+collection, () => response, {
        transform: (d) => {
            const data = d.data[collection].data;
            let lines = data.map(line => line.attributes)

            let types = d.data['types'].data;
            if (types.length > 0) {
                types = types.map(type => type.attributes)
            }
            return {
                lines: lines,
                types: types,
            };
        },
    })

    return { data, pending, refresh, error };
}
