export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'lines';

    const response = graphql(`
query Collections{
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
              sort: "createdAt"
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

    const { data, pending, refresh, error } = await useLazyAsyncData('l_data_'+collection, () => response, {
        transform: (d) => {
            const data = d.data[collection].data;
            let lines = data.map(line => line.attributes)

            return lines;
        },
    })

    return { data, pending, refresh, error };
}
