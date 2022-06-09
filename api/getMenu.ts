export default async function (lang) {
    const graphql = useStrapiGraphQL()

    const responce = await graphql(`
query Menu {
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
                    footer {
                        title
                        url
                        target
                    }
                }
            }
        }
        lines (sort: "order") {
            data {
                attributes {
                    title
                    slug
                    order
                    collections {
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
    }
`);

    const menu = responce['data'].menu.data.attributes;
    const lines = responce['data'].lines.data;

    // Check if line is empty (collection inside)
    let linesWithCollections = [];
    lines.forEach((line, index) => {
        if (line.attributes.collections.data.length > 0) {
            linesWithCollections.push(line)
        }
    });

    return [menu, linesWithCollections]
}
