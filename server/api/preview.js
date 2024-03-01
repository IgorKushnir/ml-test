export default  defineEventHandler((event) => {
    const config = useRuntimeConfig();
    const secret = config.STRAPI_PREVIEW_SECRET;

    const url = getRequestURL(event)
    const q = url.searchParams

    if (secret !== q.get('secret')) {
        return 'You have no permission'
    }


    if (q.get('type') === 'product') {
        const slug = q.get('slug')

        const locale = q.get('locale')
        let type = 'dress';
        if (locale === 'pl') type = 'suknie'
        let _url = '/'+type+'/' + slug + '?draft=true';
        if (locale !== 'en') {
            _url = '/' +locale + _url
        }
        return iFrame(_url)
    }

    if (q.get('type') === 'page') {
        const slug = q.get('slug')
        const locale = q.get('locale')
        let _url = '/' + slug + '?draft=true';
        if (locale !== 'en') {
            _url = '/' +locale + _url
        }
        return iFrame(_url)
    }

    if (q.get('type') === 'trunk-shows') {
        const slug = q.get('slug')

        const locale = q.get('locale')
        let type = 'trunk-shows';
        if (locale === 'pl') type = 'pokazy'
        let _url = '/'+type+'/' + slug + '?draft=true';
        if (locale !== 'en') {
            _url = '/' +locale + _url
        }
        return iFrame(_url)
    }

    if (q.get('type') === 'inspiration') {
        const slug = q.get('slug')

        const locale = q.get('locale')
        let type = 'inspiration';
        if (locale === 'pl') type = 'inspiration'
        let _url = '/'+type+'/' + slug + '?draft=true';
        if (locale !== 'en') {
            _url = '/' +locale + _url
        }
        return iFrame(_url)
    }

    if (q.get('type') === 'news') {
        const slug = q.get('slug')

        const locale = q.get('locale')
        let type = 'news';
        if (locale === 'pl') type = 'aktualnosci'
        let _url = '/'+type+'/' + slug + '?draft=true';
        if (locale !== 'en') {
            _url = '/' +locale + _url
        }
        return iFrame(_url)
    }
})


function iFrame(url) {
    return `
<head>
    <title>Preview</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0"><iframe 
    id="inlineFrameExample"
    style="border: none"
    sandbox="allow-scripts allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
    title="Inline Frame Example"
    width="100%"
    height="100%"
    src="${url}">
</iframe></body>`
}
