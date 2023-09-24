import axios from 'axios';
import fs from 'fs';


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();


    const response = await axios.get(config.public.strapi.url + "/api/types?populate=productLandingsRedirects&locale=all")
    if (response.status === 200) {
        const data = response.data;
        // fs.writeFile(process.cwd() + '/' +'app/dress-redirect/dress-redirects.json', JSON.stringify(data), function (err) {
        //     if (err) return console.log(err);
        //     console.log('Dress Redirects generated', process.cwd());
        // });
        let path;
        if (process.env.NODE_ENV === 'development') {
            path = 'public/dress-redirects.json'
        } else {
            path = '.output/public/dress-redirects.json'
        }
        fs.writeFile(path, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log('Dress Redirects generated to: ' + path + ' Mode: ' + process.env.NODE_ENV);
        });
        return data
    } else {
        console.log('Error Dress Redirects generated');
        return 'Error Sitemap generating'
    }

})
