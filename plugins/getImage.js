import img from '~/assets/img/placeholder.svg';
export default defineNuxtPlugin(() => {
    const {$getAbsoluteUrl} = useNuxtApp()

    return {
        provide: {
            getImage: (data, format = null) => {
                // const placeholder = '@/assets/img/logo.svg';
                const placeholder = img;
                // data == null || data.data == null || data.data.attributes == null ||
                if ( data?.data?.attributes?.formats == null) {
                    if (data?.data?.attributes?.url === null) {
                        return placeholder;
                    } else {
                        return $getAbsoluteUrl(data?.data?.attributes.url)
                    }
                }
                if (format === null || data.data.attributes.formats[format] === undefined) {
                    return $getAbsoluteUrl(data.data.attributes.url);
                }
                if (format) {
                    if (data.data.attributes.formats[format] !== null) {
                        return $getAbsoluteUrl(data.data.attributes.formats[format].url)
                    } else {
                        return placeholder
                    }
                }

            }
        }
    }
})
