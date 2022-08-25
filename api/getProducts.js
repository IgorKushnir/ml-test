export default async function ({filters, type, lang, page, pages = null}) {
    const graphql = useStrapiGraphQL()
    const collection = 'products';


    let initialPageSize = 12;
    let pageSize = initialPageSize;
    if (pages) {
        pageSize = pageSize * pages
        console.log({pages, pageSize, page});
    }



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
      pageSize: ${pageSize}
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
    id
      attributes {
        title
        slug
        type {
          data {
            attributes {
              slug
            }
          }
        }
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
            if (pages) {
                d.data[collection].meta.pagination.EDITED = true
                d.data[collection].meta.pagination.pageCount = Math.ceil(d.data[collection].meta.pagination.total / initialPageSize)
                d.data[collection].meta.pagination.page = pages
                d.data[collection].meta.pagination.pageSize = initialPageSize
            }
            // console.log(d.data[collection].meta.pagination);

            return d.data[collection]
        },
    })
}
