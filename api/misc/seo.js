function seo() {
    return `
    seo {
          metaTitle
          metaDescription
          metaImage {
            data {
              attributes {
                url
              }
            }
          }
          metaSocial {
            socialNetwork
            title
            description
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
          keywords
          metaRobots
          structuredData
          metaViewport
          canonicalURL
        }
    `
}

export default seo;
