// import _path from 'path'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const mode = config.MODE;
    // let provider = '';
    // if (mode === 'local') {
    //     provider = 'http://localhost:1337'
    // }
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    const  provider = config.STRAPI_URL
    return {
        provide: {
            getAbsoluteUrl: (path) => {
                function replaceToCDN(url) {
                    url = url.replace('nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com')

                    url = url.replace('https://nyc3.digitaloceanspaces.com/millanova', 'https://millanova.nyc3.cdn.digitaloceanspaces.com')
                    url = url.replace('https://nyc3.cdn.digitaloceanspaces.com/millanova', 'https://millanova.nyc3.cdn.digitaloceanspaces.com')

                    return url

                }
                path = replaceToCDN(path)

                if (r.test(path)) {
                    return path;
                } else {
                    return provider + path;
                }


            },
            isAbsoluteUrl: (url) => {
                let pattern = new RegExp('^(https?:\\/\\/)?'+
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+
                    '(\\#[-a-z\\d_]*)?$','i')
                return pattern.test(url);
            }
        }
    }
})
