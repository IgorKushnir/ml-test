export default async function ({filters, type, lang, page}) {
    // console.log(page);

    const graphql = useStrapiGraphQL()
    const collection = 'products';



    // function getFilter(key, values) {
    //     const _values = values.map(v => {
    //         return `{ slug: { eq: "${v}" } }`
    //     })
    //     return `{ ${key}: { or: [ ${_values.join(' ')} ] } }`
    // };
    // let _filters;
    // if (filters.length > 0) {
    //     _filters = filters.map(v => getFilter(v.key, v.values)).join(' ');
    // } else {
    //     _filters = '';
    // }

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
      pageSize: 12
      page: ${page}
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
            // console.log(d.data[collection].meta);
            return d.data[collection]
        },
    })
}
