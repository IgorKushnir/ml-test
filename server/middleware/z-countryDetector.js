import axios from 'axios';
import {isIPv4} from 'is-ip';

export default defineEventHandler(async (event) => {
    // if (process.server) {
    //     // console.log('----------', getRequestIP(event));
    //     console.log(getResponseHeaders(event));
    // }
    const headers = getRequestHeaders(event)
    let ip = headers['x-forwarded-for']
    const config = useRuntimeConfig();
    const apiKey = config.ABSTRACT_API

    ip = ip?.split(',')
    ip = ip?.[0] ?? null

    // console.log({ip});
    // console.log(isIPv4(ip));

    // event.context.country = "UA"
    // setCookie(event, 'country', "UA")
    // return

    // if (!ip) return

    if (!isIPv4(ip)) {
        const country_code = null

        event.context.country = country_code
        setCookie(event, 'country', country_code)

    } else {
        const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip
        // const url = "https://ipgeolocation.abstractapi.com/v1/?api_key=a673704aa12d440fbd1a87c392290a47&ip_address=92.184.105.98"

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
                console.error('---abstractapi error---', url);
                // console.error('---abstractapi---', e);
            }

        } else {
            event.context.country = null
            setCookie(event, 'country', null)
        }
    }



})
