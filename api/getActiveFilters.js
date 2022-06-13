export default async function ({filters, type, lang}) {

    const graphql = useStrapiGraphQL()
    const collection = 'activeFilters';



    function getFilter(key, values) {
        const _values = values.map(v => {
            return `{ slug: { eq: "${v}" } }`
        })
        return `{ ${key}: { or: [ ${_values.join(' ')} ] } }`
    };
    const _filters = filters.map(v => getFilter(v.key, v.values)).join(' ');

    // console.log(_filters);

    const response = graphql(`
query ProductsWithFilters{

  products (
    filters: {
      and: [ ${_filters} ]
      type: {
        slug: {
          eq: "${type}"
        }
      }

  }
    pagination: {
      limit: -1
    }
    sort: "title"
    locale: "${lang}"
  ) {
  meta {
      filters
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
    
  }
}
`);



    return await useAsyncData('data_'+collection, () => response, {
        transform: (d) => {
            return d.data['products']['meta']
        },
    })
}
