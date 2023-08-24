import geoip from 'geoip-lite';

export default defineEventHandler((event) => {
    const headers = getRequestHeaders(event)
    const ip = headers['x-forwarded-for']

    const geo = geoip.lookup(ip);

    if (geo) {
        event.context.country = geo.country
        setCookie(event, 'country', geo.country)
    } else {
        // null
        event.context.country = null
        setCookie(event, 'country', null)
    }

})
