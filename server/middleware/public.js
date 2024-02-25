import axios from "axios";
import fs from "fs";

export default defineEventHandler(async (event) => {
    const path = getRequestPath(event);

    if (path === "/robots.txt") {
        try {
            const response = await axios.get( "https://admin.millanova.com/robot-txt/robots")
            if (response.status === 200) {
                const data = response.data;
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


    if (path === "/sitemap.xml") {
        try {
            const response = await axios.get( "https://admin.millanova.com/api/sitemap/index.xml")
            if (response.status === 200) {
                const data = response.data;
                // return '<pre>' + data + '</pre>'
                send(event, data, 'xml')
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

