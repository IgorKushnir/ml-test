import img from '~/assets/img/placeholder.svg';
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const mode = config.MODE;
    let provider = '';
    if (mode === 'local') {
        provider = 'http://localhost:1337'
    }
    return {
        provide: {
            getImage: (data, format = null) => {
                // const placeholder = '@/assets/img/logo.svg';
                const placeholder = img;
                if (data === undefined || data.data === null || data.data === undefined) {
                    return placeholder;
                }
                if (format === null || data.data.attributes.formats[format] === undefined) {
                    return provider + data.data.attributes.url;
                }
                if (format) {
                    if (data.data.attributes.formats[format] !== null) {
                        return provider + data.data.attributes.formats[format].url
                    } else {
                        return placeholder
                    }
                }

            }
        }
    }
})
