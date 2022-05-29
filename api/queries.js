import {gql} from "@apollo/client/core"

export const getMenu = (lang) => gql`
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
`;
