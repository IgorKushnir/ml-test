import axios from 'axios';
import fs from 'fs';

export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return

    const body = await readBody(event)

    // // Get sitemap
    // const response = await axios.get(config.public.strapi.url + "/sitemap/index.xml")

    if (body) {
        try {
            if (fs.existsSync('.output/public/')) await fs.writeFileSync('.output/public/robots.txt', body);
            if (fs.existsSync('public/')) await fs.writeFileSync('public/robots.txt', body);


            setResponseStatus(event, 200)
            return  {
                status: "success",
                message: 'Robots updated: ' + new Date().toDateString()
            }
        } catch (e) {
            setResponseStatus(event, 500)
            return {
                status: "error",
                message: 'Robots has not updated. Something went wrong'
            }
        }

    } else {
        setResponseStatus(event, 500)
        return {
            status: "error",
            message: 'Robots has not updated. Body request not found'
        }
    }


})
