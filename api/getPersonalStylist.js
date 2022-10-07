import PersonalStylist from '~/api/graph/queries/personalStylist.graphql'


function personalStylist({lang = "en"}) {
    const graphql = useStrapiGraphQL()

    return graphql(PersonalStylist, {
        "lang": lang
    })
}

export default personalStylist
