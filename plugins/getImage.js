import img from '~/assets/img/placeholder.svg';
export default defineNuxtPlugin(() => {
    const {$getAbsoluteUrl} = useNuxtApp()

    return {
        provide: {
            getImage: (data, format = null) => {
                // const placeholder = '@/assets/img/logo.svg';

                function replaceToCDN(url) {
                    url = url.replace('nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com')

                    return url
                }
                const placeholder = img;
                if ( data?.data?.attributes?.formats == null) {
                    if (data?.data?.attributes?.url == null) {
                        return placeholder;
                    } else {
                        return replaceToCDN($getAbsoluteUrl(data?.data?.attributes.url))
                    }
                }
                if (format === null || data.data.attributes.formats[format] === undefined) {
                    return replaceToCDN($getAbsoluteUrl(data.data.attributes.url));
                }
                if (format) {
                    if (data.data.attributes.formats[format] !== null) {
                        return replaceToCDN($getAbsoluteUrl(data.data.attributes.formats[format].url));
                    } else {
                        return placeholder
                    }
                }

            }
        }
    }
})
