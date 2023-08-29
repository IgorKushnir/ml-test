import axios from 'axios';

export default defineEventHandler((event) => {
    const headers = getRequestHeaders(event)
    let ip = headers['x-forwarded-for']
    const config = useRuntimeConfig();
    const apiKey = config.ABSTRACT_API

    ip = '2001:871:64:5fa:49fc:56c3:8dd7:fe7c,172.68.50.87'.split(',')
    ip = ip[ip.length-1] ?? null
    const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip
    // const url = "https://ipgeolocation.abstractapi.com/v1/?api_key=3cfbdffdc28f4360988300e9663c1f00&ip_address=92.184.105.98"

    if (ip) {
        axios.get(url)
            .then(response => {
                const geo = response.data;
                event.context.country = geo.country_code
                setCookie(event, 'country', geo.country_code)
            })
            .catch(error => {
                event.context.country = null
                setCookie(event, 'country', null)
                console.log(error);
            });
    } else {
        event.context.country = null
        setCookie(event, 'country', null)
    }



})
