import axios from 'axios';
import fs from 'fs';

export default  defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    // Get sitemap
    const response = await axios.get(config.public.strapi.url + "/sitemap/index.xml")
    // console.log(response);
    if (response.status === 200) {
        const data = response.data;
        fs.writeFile('.output/public/sitemap.xml', data, function (err) {
            if (err) return console.log(err);
            console.log('Sitemap generated');
        });
        return 'Generated: ' + new Date().toDateString()
    } else {
        console.log('Error Sitemap generating');
        return 'Error Sitemap generating'
    }

})
