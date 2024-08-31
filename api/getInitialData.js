import seo from './misc/seo'
import locals from './misc/locals'

export default async function (lang) {
    const graphql = useStrapiGraphQL()

    const menuAndLines = `
    menu(locale:"${lang}") {
            data {
                attributes {
                    primary {
                        title
                        url
                        target
                        collections
                        cover_4x3 {
                            data {
                              attributes {
                                url
                                formats
                                placeholder
                              }
                            }
                          }
                        items {
                            title
                            url
                            target
                        }
                    }
                    primary_additional {
                      title
                      url
                      target
                    }
                    footer_additional {
                      title
                      url
                      target
                      logo {
                        data {
                          attributes {
                            url
                            formats
                            mime
                            placeholder
                          }
                        }
                      }
                      description
                    }
                    social {
                      title
                      url
                      icon
                    }
                }
            }
        }
        lines (sort: "order" locale:"${lang}") {
            data {
                attributes {
                    title
                    slug
                    order
                    collections (
                      sort: "order"
                    ){
                        data {
                            attributes {
                                title
                                slug
                                cover_4x3 {
                                    data {
                                      attributes {
                                        url
                                        formats
                                        placeholder
                                      }
                                    }
                                  }
                            }
                        }
                    }
                }
            }
        }
    `
    const types = `
        types(
            sort: "order"
            locale: "${lang}"
            pagination: {
              limit: -1
            }
          ) {
            data {
              attributes {
              ${seo()}
              ${locals()}
                title
                slug
              }
            }
      }
    `;

    const translations = `
        transtation(locale: "${lang}") {
            data {
              attributes {
                footer_title
                footer_copyright
                moodboard_description
                seo_pattern {
                  name
                  pathStartsWith
                  title
                  description
                  keywords
                }
              }
            }
          }
    `
    const response = graphql(`query Initial{ ${ [ menuAndLines, types, translations  ].join('') } }`);


    return await useAsyncData('data_initial', () => response, {
        transform: (d) => {
            const menu = d.data.menu.data.attributes;

            // Check if line is empty (collection inside)
            let lines = d.data?.lines?.data
            lines = lines.filter(l => l.attributes.collections.data.length > 0)

            let types = d.data.types.data
            if (types.length > 0) {
                types = types.map(type => type.attributes)
            }

            let translations = d.data.transtation.data.attributes
            translations.seo_pattern = translations.seo_pattern.sort((a, b) => {
                    if ((a.pathStartsWith && a.pathStartsWith !== '')) {
                        return -1
                    } else {
                        return 1
                    }
                })

            // return [menu, lines, types, translations]
            return {menu, lines, types, translations}
        },
    })
}
