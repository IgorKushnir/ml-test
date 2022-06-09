export default async function (slug, lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'pages';

    const response = graphql(`
query Page{
  pages (
  locale: "${lang}"
    filters: {
      slug: {
        eq: "${slug}"
      }
    }
  ) {
    data {
      attributes {
        title
        sub_title
        sub_header
        content {
          ...on ComponentContentText {
          __typename
            text
          }
          ...on Error {
            message
            code
          }
        }
      }
    }
  }
}
`);


    const { data, pending, refresh, error } = await useAsyncData('data_'+collection, () => response, {
        transform: (d) => d.data[collection].data[0] ? d.data[collection].data[0].attributes : null,
    })
    return { data, pending, refresh, error };
}
