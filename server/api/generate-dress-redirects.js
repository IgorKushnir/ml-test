import axios from 'axios';
import fs from 'fs';


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();


    const response = await axios.get(config.public.strapi.url + "/api/types?populate=productLandingsRedirects&locale=all")
    if (response.status === 200) {
        const data = response.data;
        fs.writeFile('.output/dress-redirects.json', JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log('Dress Redirects generated');
        });
        // fs.writeFile('public/dress-redirects.json', JSON.stringify(data), function (err) {
        //     if (err) return console.log(err);
        //     console.log('Dress Redirects generated');
        // });
        return data
    } else {
        console.log('Error Dress Redirects generated');
        return 'Error Sitemap generating'
    }

})
