export default async function () {
    // const { data, error } = await useAsyncData('country_code', () => $fetch('https://www.cloudflare.com/cdn-cgi/trace'))
    // // console.log(error.value, data.value);
    // if (!error.value && data.value) {
    //     console.log(data.value);
    //     const d = data.value.trim().split('\n').reduce(function(obj, pair) {
    //         pair = pair.split('=');
    //         return obj[pair[0]] = pair[1], obj;
    //     }, {})
    //
    //     return d.loc;
    // }
    // return null


    if (process.client) {
        const country = document.cookie.replace(
            /(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        return country;
        // console.log('client', country);
    }
    if (process.server) {
        const nuxtApp = useNuxtApp()
        const {ssrContext} = nuxtApp
        const event = ssrContext.event
        const country = event.context.country
        return  country
        // console.log('server', country);
    }
}
