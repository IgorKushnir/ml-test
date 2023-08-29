import axios from 'axios';

export default defineEventHandler((event) => {
    // const headers = getRequestHeaders(event)
    // let ip = headers['x-forwarded-for']
    // const config = useRuntimeConfig();
    // const apiKey = config.ABSTRACT_API
    //
    // ip = ip.split(',')
    // ip = ip[ip.length-1] ?? null
    // const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip
    // // const url = "https://ipgeolocation.abstractapi.com/v1/?api_key=3cfbdffdc28f4360988300e9663c1f00&ip_address=92.184.105.98"
    //
    // if (ip) {
    //     axios.get(url)
    //         .then(response => {
    //             const geo = response.data;
    //             event.context.country = geo.country_code
    //             setCookie(event, 'country', geo.country_code)
    //             setCookie(event, 'ip', geo.country_code)
    //         })
    //         .catch(error => {
    //             event.context.country = null
    //             setCookie(event, 'country', null)
    //             setCookie(event, 'ip', null)
    //             console.log('abstractapi', error.code);
    //         });
    // } else {
    //     event.context.country = null
    //     setCookie(event, 'country', null)
    // }


    event.context.country = null
    setCookie(event, 'country', null)


})
