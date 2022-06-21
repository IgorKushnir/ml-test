import img from '~/assets/img/placeholder.svg';
export default defineNuxtPlugin(() => {
    const {$getAbsoluteUrl} = useNuxtApp()

    return {
        provide: {
            getImage: (data, format = null) => {
                // const placeholder = '@/assets/img/logo.svg';
                const placeholder = img;

                if (data === undefined || data.data === null || data.data === undefined || data.data.attributes === null) {
                    return placeholder;
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
