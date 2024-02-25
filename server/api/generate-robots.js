import axios from 'axios';
import fs from 'fs';

export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return

    const body = await readBody(event)

    // // Get sitemap
    // const response = await axios.get(config.public.strapi.url + "/sitemap/index.xml")

    if (body) {
        try {
            const folders = []
            if (fs.existsSync('.output/public/')) {
                await fs.writeFileSync('.output/public/robots.txt', body);
                folders.push('.output/public/robots.txt')
            }
            // if (fs.existsSync('public/')) {
            //     await fs.writeFileSync('public/robots.txt', body);
            //     folders.push('public/')
            // }


            setResponseStatus(event, 200)
            return  {
                status: "success",
                message: 'Robots updated: ' + new Date().toDateString(),
                folders
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
