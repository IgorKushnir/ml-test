function content() {
    return `
    content {
    ...on ComponentContentCarusel {
            __typename
            carusel_layout: layout
            text
            column
            carusel {
              title
              text
              media {
                data {
                   attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
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
              media {
                data {
                  attributes {
                    mime
                    formats
                    url
                    placeholder
                    width
                    height
                  }
                }
              }
            }
          }
          
            ...on ComponentContentBlocks {
            __typename
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
                }
              }
            }
          }
        }
    `
}

export default content;
