import axios from "axios";

export default defineEventHandler(async (event) => {
    console.log(event);
    const path = getRequestPath(event);
    const url = process.env.STRAPI_URL
    const shouldBlockRobots = !!process.env.BLOCK_ROBOTS

    if (path === "/robots.txt") {
        if (shouldBlockRobots) {
            return '<pre>User-agent: * Disallow: /</pre>'
        } else {
        try {
            const response = await axios.get( url + "/robot-txt/robots")
            if (response.status === 200) {
                const data = response?.data.body;
                return '<pre>' + data + '</pre>'
            } else {
                throw 'response.status: '+ response.status
            }
        } catch (e) {
            console.error('Error Robots');
            console.error(e);
            return ''
        }
    }
    }


    if (path === "/sitemap.xml") {
        try {
            const response = await axios.get( url + "/api/sitemap/index.xml")
            if (response.status === 200) {
                const data = response?.data;
                // return '<pre>' + data + '</pre>'
                send(event, data, 'xsl')
                // return data
            } else {
                throw 'response.status: '+ response.status
            }
        } catch (e) {
            console.error('Error sitemap');
            console.error(e);
            return ''
        }
    }
    if (path.startsWith('/xsl')) {
        try {
            const response = await axios.get( "https://admin.millanova.com/api/sitemap"+path)
            if (response.status === 200) {
                const data = response?.data;
                // return '<pre>' + data + '</pre>'
                send(event, data, 'xsl')
                // return data
            } else {
                throw 'response.status: '+ response.status
            }
        } catch (e) {
            console.error('Error sitemap');
            console.error(e);
            return ''
        }
    }
})

