import content from './misc/content'
import seo from './misc/seo'


function getNews(lang, page = 1, pageSize = 100) {
    const graphql = useStrapiGraphQL()



    const response = graphql(`
    query News{
  news (
    locale: "${lang}"
        pagination: {
        page: ${page}
        pageSize: ${pageSize}
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
      ${seo()}
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
