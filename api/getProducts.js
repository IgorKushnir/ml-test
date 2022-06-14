export default async function ({filters, type, lang}) {

    const graphql = useStrapiGraphQL()
    const collection = 'products';



    function getFilter(key, values) {
        const _values = values.map(v => {
            return `{ slug: { eq: "${v}" } }`
        })
        return `{ ${key}: { or: [ ${_values.join(' ')} ] } }`
    };
    let _filters;
    if (filters.length > 0) {
        _filters = filters.map(v => getFilter(v.key, v.values)).join(' ');
    } else {
        _filters = '';
    }


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
      limit: 12
    }
    sort: "title"
    locale: "${lang}"
  ) {
  meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
    
    data {
      attributes {
        title
        slug
        cover_3x4 {
          data {
            attributes {
              formats
              url
              placeholder
            }
          }
        }
      }
    }
  }
}
`);



    return await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => {
            return d.data[collection]
        },
    })
}
