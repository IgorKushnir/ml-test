import axios from 'axios';

export default defineEventHandler(async (event) => {
    const headers = getRequestHeaders(event)
    let ip = headers['x-forwarded-for']
    const config = useRuntimeConfig();
    const apiKey = config.ABSTRACT_API

    ip = ip.split(',')
    ip = ip[ip.length-1] ?? null
    const url = "https://ipgeolocation.abstractapi.com/v1/?api_key="+apiKey+"&ip_address="+ip


    const response = await axios.get(url)
    return {
        ip: ip,
        abstract: response.data
    }


})
