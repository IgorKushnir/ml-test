export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const mode = config.MODE;
    let provider = '';
    if (mode === 'local') {
        provider = 'http://localhost:1337'
    }
    return {
        provide: {
            getAbsoluteUrl: (path) => {
                return provider + path;

            }
        }
    }
})
