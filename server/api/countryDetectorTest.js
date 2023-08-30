import axios from 'axios';

export default defineEventHandler(async (event) => {
    // return getRequestIP(event, { xForwardedFor: true });
    const headers = getRequestHeaders(event)
    let ip = headers['x-forwarded-for']
    const config = useRuntimeConfig();
    const apiKey = config.ABSTRACT_API

    ip = ip.split(',')
    ip = ip[0] ?? null
    const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip


    const response = await axios.get(url)
    return {
        ip: ip,
        ips: headers['x-forwarded-for'],
        abstract: response.data
    }


})
