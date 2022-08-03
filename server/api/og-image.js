import renderSocialImage from "puppeteer-social-image";
import puppeteer from "puppeteer";

export default  defineEventHandler(async (event) => {

    const url = new URL('http://test.test' + event.req.url).search;
    const urlParams = new URLSearchParams(url)

    const title = urlParams.get('title');
    const image = urlParams.get('image');
    // console.log(iii);

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
        browser: await puppeteer.launch({})
        // preview: true
    })
    return img
})
