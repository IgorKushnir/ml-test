function content(extra) {
    if (!extra) extra = '';

    return `
    content {
    ${extra}
    
    ...on ComponentContentLatestContent {
            __typename
            amount
            instance
          }
    
    ...on ComponentContentEmbedVideo {
            __typename
            layout
            embed
          }
    
    ...on ComponentContentDivider {
            __typename
            size
            line
          }
          
    ...on ComponentContentPoster {
            __typename
            poster {
              title
              text
              button_text
              button_link
              button
              wide
              cover_3x4 {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                    alternativeText
                  }
                }
              }
              cover_4x3 {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                    alternativeText
                  }
                }
              }
              
            }
          }
          
    ...on ComponentContentCarusel {
            __typename
            carusel_layout: layout
            column
            carusel {
              title
              text
              link
              media {
                data {
                   attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                    alternativeText
                  }
                }
              }
            }
          }
    
    ...on ComponentContentMediaBanner {
            __typename
            media_banner_layout: layout
            banner {
              title
              text
              button_text
              button_link
              button
              cover_4x3 {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                    alternativeText
                  }
                }
              }
              cover_3x4 {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                    alternativeText
                  }
                }
              }
              
            }
          }
          
            ...on ComponentContentBlocks {
            __typename
            type
            blocks {
              ratio
              media {
                data {
                  attributes {
                    height
                    width
                    formats
                    url
                    placeholder
                    mime
                    alternativeText
                  }
                }
              }
              text
            }
          }
          
          ...on ComponentContentText {
            __typename
            text_layout:layout
            text
          }
          
          ...on ComponentContentFact {
            __typename
            title
            text
            logo
            ratio
            fact_layout:layout
            background_color
            text_color
          }
          
          ...on ComponentContentImageVideoGrig {
            __typename
            columns
            grid_layout: layout
            media {
              data {
                attributes {
                  mime
                  formats
                  url
                  placeholder
                  width
                  height
                  alternativeText
                }
              }
            }
          }
        }
    `
}

export default content;
