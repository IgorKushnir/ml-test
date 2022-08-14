export default async  (req, res, next) => {
    const config = useRuntimeConfig();
    const secret = config.STRAPI_PREVIEW_SECRET;
    const host = 'http://' + req.headers.host

    const url = new URL(host + req.url)
    const q = url.searchParams

    if (secret !== q.get('secret')) {
        res.end('You have no permission');
    }


    if (q.get('type') === 'product') {
        const slug = q.get('slug')
        const _url = '/product/' + slug + '?draft=true';
        res.end(iFrame(_url))

    }

    if (q.get('type') === 'page') {
        const slug = q.get('slug')
        const _url = '/' + slug + '?draft=true';
        res.end(iFrame(_url))
    }

    if (q.get('type') === 'trunk-shows') {
        const slug = q.get('slug')
        const _url = '/trunk-shows/' + slug + '?draft=true';
        res.end(iFrame(_url))
    }

    if (q.get('type') === 'inspiration') {
        const slug = q.get('slug')
        const _url = '/inspiration/' + slug + '?draft=true';
        res.end(iFrame(_url))
    }

    if (q.get('type') === 'news') {
        const slug = q.get('slug')
        const _url = '/news/' + slug + '?draft=true';
        res.end(iFrame(_url))
    }



}


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
