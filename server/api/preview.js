// export default defineEventHandler((event) => {
//     return {
//         api: 'works'
//     }
// })
export default async  (req, res, next) => {
    const config = useRuntimeConfig();
    const secret = config.STRAPI_PREVIEW_SECRET;


    const url = new URL("https://test.test" + req.url)
    const q = url.searchParams

    if (secret !== q.get('secret')) {
        res.end('You have no permission');
    }

    if (q.get('type') === 'product') {
        const slug = q.get('slug')
        res.writeHead('302', { Location: '/product/' + slug + '?draft=true'});
        res.end();
    }

    if (q.get('type') === 'page') {
        const slug = q.get('slug')
        res.writeHead('302', { Location: '/' + slug + '?draft=true'});
        res.end();
    }

    if (q.get('type') === 'trunk-shows') {
        const slug = q.get('slug')
        res.writeHead('302', { Location: '/trunk-shows/' + slug + '?draft=true'});
        res.end();
    }

    if (q.get('type') === 'inspiration') {
        const slug = q.get('slug')
        res.writeHead('302', { Location: '/inspiration/' + slug + '?draft=true'});
        res.end();
    }

    if (q.get('type') === 'news') {
        const slug = q.get('slug')
        res.writeHead('302', { Location: '/news/' + slug + '?draft=true'});
        res.end();
    }


}
