
async function getPressAboutUs(lang) {
    const graphql = useStrapiGraphQL()

    const response = graphql(`
    query TrunkShows{
  pressAboutUses (
    locale: "${lang}"
    pagination: {
      limit: -1
    }
  ) {
    data {
      attributes {
        title
        slug
        description
        cover_4x3 {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
        logo {
          data {
            attributes {
              url
              formats
              placeholder
            }
          }
        }
        url
      }
    }
  }
}
    `);

    const {data, pending, refresh, error} = await useLazyAsyncData('pressAboutUs', () => response, {
        transform: (d) => d.data?.pressAboutUses?.data
    })

    return {data, pending, refresh, error};
}



export { getPressAboutUs }
