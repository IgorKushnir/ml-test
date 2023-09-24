const axios = require('axios');
const fs = require('fs');

async function init() {
    // const url = 'http://localhost:1337'
    const url = 'https://admin.millanova.com'

    const response = await axios.get(url + "/api/types?populate=productLandingsRedirects&locale=all")
    if (response.status === 200) {
        const data = response.data;
        let path;
        if (process.env.NODE_ENV === 'development') {
            path = 'public/dress-redirects.json'
        } else {
            path = '.output/public/dress-redirects.json'
        }
        fs.writeFile(path, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log('Dress Redirects generated');
        });
        return 'Generated: ' + new Date().toDateString()
    } else {
        console.log('Error Dress Redirects generated');
    }
}

init()

