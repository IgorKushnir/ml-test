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
                console.log();
                if (r.test(path)) {
                    return path;
                } else {
                    return provider + path;
                }


            }
        }
    }
})
