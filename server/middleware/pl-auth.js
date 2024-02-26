export default defineEventHandler(async (event) => {


    // const cookies = parseCookies(event)
    // const show_pl = cookies?.show_pl
    //
    //
    // if (show_pl !== 'true') {
        const path = getRequestPath(event);
        if (path.startsWith('/pl')) {
            console.log({path});
            // if (!(path.startsWith('/pl/request-an-appointment/flagship')) ) {
            //     sendRedirect(event, '/dress', 301)
            //     // console.log('yes');
            // } else {
            //     // console.log('false');
            // }
        }
    //
    //
    // }

})

// export default fromNodeMiddleware(async (req, res, next) => {
//     // console.log(req.headers.cookie);
//     if (req.url.startsWith('/pl')) {
//         res.writeHead(301, { Location: '/222' });
//         res.end();
//     }
// })
