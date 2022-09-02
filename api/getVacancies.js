import ProductTiles from '~/api/graph/queries/vacancy.graphql'


function vacancies({lang = "en"}) {
    const graphql = useStrapiGraphQL()

    return graphql(ProductTiles, {
        "lang": lang
    })
}

export default vacancies
