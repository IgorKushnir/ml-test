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
          metaRobots
          structuredData
          metaViewport
          canonicalURL
          seoText
        }
    `
}

export default seo;
