const axios  = require('axios');
const fs = require('fs');

async function init() {
    // Get sitemap

    try {
        const response = await axios.get( "https://admin.millanova.com/sitemap/index.xml")
        if (response.status === 200) {
            const data = response.data;
            fs.writeFile('public/sitemap.xml', data, function (err) {
                if (err) return console.log(err);
                console.log('Sitemap generated');
            });
        } else {
            console.log('Error Sitemap generated');
        }
    } catch (e) {
        console.log(e);
    }

}
init()
