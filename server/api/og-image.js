import renderSocialImage from "puppeteer-social-image";
import puppeteer from "puppeteer";
// import chromium  from 'chrome-aws-lambda';

export default defineEventHandler(async (event) => {

    const url = new URL('http://test.test' + event.req.url).search;
    const urlParams = new URLSearchParams(url)

    const title = urlParams.get('title');
    const image = urlParams.get('image');

    console.log( puppeteer.executablePath(), '--- Browser ---');

    const img = await renderSocialImage.default({
        // template: "basic",
        templateBody: '<img src={{image}}>' +
            '<div class="main">{{title}}</div>',
        templateStyles: `
            img {
                position: absolute;
                object-position: center 25%;
                height: 100%;
                width: 100%;
                object-fit: cover;
                z-index: 0;
            }
            .main {
                position: absolute;
                color: white;
                bottom: 32px;
                left: 32px;
                font-size: 48px;
                z-index: 1;
            }
        `,
        templateParams: {
            image: image ?? "",
            title: title ?? 'Milla Nova'
        },
        output: "image.png",
        size: "facebook",
        browser: await puppeteer.launch({
            executablePath: puppeteer.executablePath(),
            headless: true
            // executablePath: '/Users/rodney/Documents/Dev/projects/millanova-frontend/node_modules/puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
            // executablePath: __dirname + '/../../puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
            // executablePath: __dirname + '/../../puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome',
            // executablePath: '/workspace/node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome',
        })
        // browser: await chromium.puppeteer.launch({
        //     args: chromium.args,
        //     defaultViewport: chromium.defaultViewport,
        //     executablePath: await chromium.executablePath,
        //     headless: chromium.headless,
        //     ignoreHTTPSErrors: true,
        //     // executablePath: '/Users/rodney/Documents/Dev/projects/millanova-frontend/node_modules/puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        //     // executablePath: __dirname + '/../../puppeteer/.local-chromium/mac-1022525/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        //     // executablePath: __dirname + '/../../puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome',
        //     // executablePath: '/workspace/node_modules/puppeteer/.local-chromium/linux-1022525/chrome-linux/chrome',
        // })
        // preview: true
    })
    return img
})
