import axios from 'axios';

export default defineEventHandler(async (event) => {
    const headers = getRequestHeaders(event)
    let ip = headers['x-forwarded-for']
    const config = useRuntimeConfig();
    const apiKey = config.ABSTRACT_API

    ip = ip.split(',')
    ip = ip[0] ?? null
    const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip
    // const url = "https://ipgeolocation.abstractapi.com/v1/?api_key=3cfbdffdc28f4360988300e9663c1f00&ip_address=92.184.105.98"

    if (ip) {
        try {
            const {data} = await axios.get(url)
            if (data) {
                event.context.country = data.country_code
                setCookie(event, 'country', data.country_code)
            }
        } catch (e) {
            event.context.country = null
            setCookie(event, 'country', null)
            console.error('abstractapi', e);
        }

    } else {
        event.context.country = null
        setCookie(event, 'country', null)
    }


})
