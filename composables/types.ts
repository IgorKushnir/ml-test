type TypeSlug = 'accessories' | 'dress' | 'veils' | 'product' | 'suknie' | 'welony' | 'akcesoria' | 'produkt'

export type SeoType = {
    canonicalURL: null | string
    metaDescription: null | string
    metaRobots: null | string
    metaTitle: null | string
    metaViiewPort: null | string
    seoText: null | string
    structuredData: null | string
    metaImage: {
        data: null | string
    }
}

export type TypeItem = {
    slug: TypeSlug
    title: string
    seo: SeoType
    localizations: {data: { attributes: {locale: 'pl' | 'en'; slug: TypeSlug} }[]}
}