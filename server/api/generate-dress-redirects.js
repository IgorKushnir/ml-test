import axios from 'axios';
import fs from 'fs';


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();


    const response = await axios.get(config.public.strapi.url + "/api/types?populate=productLandingsRedirects&locale=all")
    if (response.status === 200) {
        const data = response.data;
        fs.writeFile('app/dress-redirect/dress-redirects.json', JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log('Sitemap generated');
        });
        return 'Generated: ' + new Date().toDateString()
    } else {
        console.log('Error Sitemap generating');
        return 'Error Sitemap generating'
    }

})
