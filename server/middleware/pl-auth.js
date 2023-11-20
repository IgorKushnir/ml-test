export default defineEventHandler(async (event) => {


    const cookies = parseCookies(event)
    const show_pl = cookies?.show_pl
    if (show_pl !== 'true') {
        const path = getRequestPath(event);

        if (path.startsWith('/pl')) {
            console.log('yes', path);
            sendRedirect(event, '/dress', 301)
        }
    }

})

// export default fromNodeMiddleware(async (req, res, next) => {
//     // console.log(req.headers.cookie);
//     if (req.url.startsWith('/pl')) {
//         res.writeHead(301, { Location: '/222' });
//         res.end();
//     }
// })
