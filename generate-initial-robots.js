const axios  = require('axios');
const fs = require('fs');

async function init() {

    try {
        const response = await axios.get( "https://admin.millanova.com/robot-txt/robots")
        if (response.status === 200) {
            const data = response.data;
            fs.writeFile('public/robots.txt', data, function (err) {
                if (err) return console.log(err);
                console.log('Robots generated');
            });
        } else {
            console.log('Error Robots generated');
        }
    } catch (e) {
        console.error('Error Robots');
        console.error(e);
    }

}
init()
