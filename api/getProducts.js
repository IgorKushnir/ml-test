export default async function ({filters, type, lang, page, pages = null, topProducts}) {

    // console.log({filters, type, lang, page, pages})
    const graphql = useStrapiGraphQL()
    const collection = 'products';

    let initialPageSize = 12;
    let pageSize = initialPageSize;
    if (pages) {
        pageSize = pageSize * pages
        // console.log({pages, pageSize, page});
    }

    let extrudeFilter = ''
    if (topProducts) extrudeFilter = 'id: { notIn: ['+topProducts.join(',')+']}'



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

    let typeFilter = ''
    if (type) {
        typeFilter = `type: {
        slug: {
            eq: "${type}"
        }
    }`
    }
    const data = `    data {
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
        silhouettes {
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
        gallery {
          data {
            attributes {
              mime
              width
              height
              url
              formats
              placeholder
            }
          }
        }
      }
    }
  }`

    const response = graphql(`
query ProductsWithFilters{

${topProducts ? `
topProducts:products (
    filters: {
      or: [ { discontinued: { eq: null } } { discontinued: { eq: false } } ] 
      and: [ ${_filters} ]
      ${typeFilter}
      id: {in: [${topProducts.join(',')}]}

  }
    pagination: {
      pageSize: ${pageSize}
      page: ${page}
    }
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
    
    ${data}
` : ``}


  products (
    filters: {
      or: [ { discontinued: { eq: null } } { discontinued: { eq: false } } ] 
      and: [ ${_filters} ]
      ${typeFilter}
      ${extrudeFilter}

  }
    pagination: {
      pageSize: ${pageSize}
      page: ${page}
    }
    sort: ["collection.order:asc", "title"]
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
    
    ${data}
}
`);





    return response
}
