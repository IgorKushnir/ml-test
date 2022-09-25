// const axios = require('axios').default;
import axios from 'axios';

export default async  (req, res, next) => {
    const config = useRuntimeConfig();
    // console.log('New request: ' + req.url)


    // // Redirects from predefined list
    // redirects.forEach(item => {
    //     item.forEach(red => {
    //         redirect(red.from, red.to, red.code)
    //     })
    // })


    // Redirect from '/' to ''
    if (req.url !== '/' && req.url.endsWith('/')) {
        redirect(req.url, req.url.slice(0, -1), 301)
        return
    }


    // Redirect from admin list
    const response = await axios.get(config.STRAPI_URL + "/api/redirects")
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






    function redirect(from, to, code = 301) {
        if (!from.startsWith('/')) from = '/' + from

        if (req.url === from || req.url === from + '/') {
            res.writeHead(code, { Location: to });
            res.end();
        } else {
            next();
        }
    }

}

