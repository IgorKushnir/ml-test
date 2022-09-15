import NewsLatter from '~/api/graph/queries/newsletter.graphql'


function newsletter({lang = "en"}) {
    const graphql = useStrapiGraphQL()

    return graphql(NewsLatter, {
        "lang": lang
    })
}

export default newsletter
