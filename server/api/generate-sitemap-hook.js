import axios from 'axios';
import fs from 'fs';

export default async  (req, res, next) => {
    const config = useRuntimeConfig();


    // Get sitemap
    const response = await axios.get(config.STRAPI_URL + "/sitemap/index.xml")
    if (response.status === 200) {
        const data = response.data;
        // console.log(data);
        // res.end(data)

        fs.writeFile('.output/public/sitemap.xml', data, function (err) {
            if (err) return console.log(err);
            console.log('Sitemap generated');
        });
    } else {
        console.log('Error Sitemap generated');
    }
    res.end('Generated: ' + new Date().toDateString())

}
