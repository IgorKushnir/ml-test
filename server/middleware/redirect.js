import axios from 'axios';
export default fromNodeMiddleware(async (req, res, next) => {

    const config = useRuntimeConfig();

    const protocol = req.connection.encrypted ? 'https' : 'http';
    const baseUrl = protocol + '://' + req.headers.host;



    // !!!!!! setResponseStatus(event, 202)

    // if (req.url === '/dress?silhouettes=a-line') {
    //     res.writeHead(301, { Location: '/silhouette/a-line' });
    //     res.end();
    // }


    // if (req.url === '/silhouette/a-line') {
    //     try {
    //         const page1Response = await axios.get(baseUrl + '/dress?silhouettes=a-line');
    //         res.setHeader('Content-Type', 'text/html');
    //         res.end(page1Response.data);
    //
    //     } catch (error) {
    //         next();
    //     }
    // }











    // console.log('New request: ' + req.url)

    // // Redirects from predefined list
    // redirects.forEach(item => {
    //     item.forEach(red => {
    //         redirect(red.from, red.to, red.status)
    //     })
    // })


    // Redirect from '/' to ''
    if (req.url !== '/' && req.url.endsWith('/')) {
        redirect(req.url, req.url.slice(0, -1), 301)
        return
    }


    // Redirect from admin list
    const response = await axios.get(config.STRAPI_URL + "/api/redirects?pagination[limit]=-1")
    if (response.status === 200) {
        const data = response.data.data;
        // console.log(data);
        data.forEach(item => {
            const from = item.attributes.from;
            const to = item.attributes.to;
            const condition = from && to;
            if (condition) {
                redirect(from, to, item.attributes.status)
            }
        })
    }






    function redirect(from, to, status = 301) {
        if (!from.startsWith('/')) from = '/' + from

        if (req.url === from || req.url === from + '/' || req.url  + '/' === from) {
            res.writeHead(status, { Location: to });
            res.end();
        } else {

            next();
        }
    }

})

