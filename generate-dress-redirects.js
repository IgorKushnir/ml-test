const axios = require('axios');
const fs = require('fs');

async function init() {
    // const url = 'http://localhost:1337'
    const url = 'https://admin.millanova.com'

    const response = await axios.get(url + "/api/types?populate=productLandingsRedirects&locale=all")
    if (response.status === 200) {
        const data = response.data;
        // fs.writeFile('app/dress-redirect/dress-redirects.json', JSON.stringify(data), function (err) {
        //     if (err) return console.log(err);
        //     console.log('Dress Redirects generated');
        // });
        fs.writeFile('public/dress-redirects.json', JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            console.log('Dress Redirects generated');
        });
        return 'Generated: ' + new Date().toDateString()
    } else {
        console.log('Error Dress Redirects generated');
    }
}

init()

