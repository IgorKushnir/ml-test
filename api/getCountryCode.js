export default async function () {
    const { data, error } = await useAsyncData('country_code', () => $fetch('https://www.cloudflare.com/cdn-cgi/trace'))
    console.log(error.value, data.value);
    if (!error.value && data.value) {
        console.log(data.value);
        const d = data.value.trim().split('\n').reduce(function(obj, pair) {
            pair = pair.split('=');
            return obj[pair[0]] = pair[1], obj;
        }, {})

        return d.loc;
    }
    return null
}
