export default async function () {
    const { data, error } = await useAsyncData('country_code', () => $fetch('https://www.cloudflare.com/cdn-cgi/trace'))
    if (!error.value) {
        const d = data.value.trim().split('\n').reduce(function(obj, pair) {
            pair = pair.split('=');
            return obj[pair[0]] = pair[1], obj;
        }, {})
        return d.loc;
    }
    return null
}
