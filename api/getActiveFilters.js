export default async function ({filters, type, lang, fetchFilters}) {

    const graphql = useStrapiGraphQL()
    const collection = 'activeFilters';
    const activeFiltersData = fetchFilters ? 'filters' : '';

    // console.log(filters);


    // function getFilter(key, values) {
    //     const _values = values.map(v => {
    //         return `{ slug: { eq: "${v}" } }`
    //     })
    //     return `{ ${key}: { or: [ ${_values.join(' ')} ] } }`
    // };
    // const _filters = filters.map(v => getFilter(v.key, v.values)).join(' ');


    const _filters = filters.map(f => {
        const val = f.values.map(v => {
            return `{
                slug: {
                  eq: "${v}"
                }
              }`
        }).join(' ')
        return `{ ${f.key}  : { or: [ ${val} ] } }`
    }).join(' ');
    // console.log(_filters);


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
      ${activeFiltersData}
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
