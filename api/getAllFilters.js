export default async function (lang) {
    const graphql = useStrapiGraphQL()
    const collection = 'allFilters';

    const response = graphql(`
query getAllFilters{
  silhouettes (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  
  fabrics (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  styles (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  necklines (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  decorations (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  colors (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  decorations (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  others (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  budgets (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  accessoires (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  shoes (
    locale: "${lang}",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
  
  backnecklines (
    locale: "en",
    pagination: {
      limit: -1
    }
  ){
    data {
      attributes {
        title
        slug
      }
    }
  }
}
`);

    const { data, pending, refresh, error } = await useLazyAsyncData('data_'+collection, () => response, {
        transform: (d) => {
            const keys = Object.keys(d?.data);
            return keys.map(k => {
                return {
                    uid: k,
                    data: d?.data[k]?.data
                }
            })
        },
    })
    return { data, pending, refresh, error };
}
