import content from './misc/content'


function getNews(lang, page) {
    const graphql = useStrapiGraphQL()

    // page: ${page}
    // pageSize: 8

    const response = graphql(`
    query News{
  news (
    locale: "${lang}"
        pagination: {
        limit: -1
      }
      sort: "created:desc"
  ){
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
        created
		cover_1x1 {
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


    return response
}

async function getNewsPost(slug, lang) {
    const graphql = useStrapiGraphQL()

    const response = graphql(`
    query NewsPost{
  newspost (
    locale: "${lang}"
    slug: "${slug}"
    
  ){
    data {
      attributes {
        title
        slug
        created
        ${content()}
        cover_3x1 {
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

    const {data, pending, refresh, error} = await useLazyAsyncData('data_newsPost', () => response, {
        transform: (d) => d.data['newspost'].data
    })

    return {data, pending, refresh, error};
}

export { getNews, getNewsPost };
