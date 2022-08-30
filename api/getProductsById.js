import ProductTiles from '~/api/graph/queries/productTiles.graphql'


function products({lang = "en", products = []}) {
    const graphql = useStrapiGraphQL()

    return graphql(ProductTiles, {
        "products": products,
        "lang": lang
    })
}

export default products
