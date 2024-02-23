function locals(page) {
    if (page === 'product') {
        return `localizations {
          data {
            attributes {
              slug
              locale
              type {
                data {
                  attributes {
                    slug
                  }
                }
              }
            }
          }
        }`
    } else {
        return `
        localizations {
              data {
                attributes {
                  locale
                  slug
                }
              }
            }
        `

    }

}

export default locals;
