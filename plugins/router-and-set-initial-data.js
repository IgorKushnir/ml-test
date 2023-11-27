import {defineNuxtPlugin} from '#app'
import {getDressRedirects, generateRandomID, convertPathToQueryObject} from "~/api/getDressRedirects";
import {useFiltersData, useTypesData, useMenuData, useTranslationsData} from "~/composables/states";
import getAllFilters from '~/api/getAllFilters'
import getInitialData from '~/api/getInitialData';


const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})

async function setInitialData(lang) {
    // get Initial data (Menu, Lines, Types)
    let {data: initialData, error: initialError} = await getInitialData(lang);
    if (!initialError.value) {
        useMenuData().value = [initialData.value[0], initialData.value[1]]
        useTypesData().value = initialData.value[2];

        // console.log(lang,initialData.value[2]);


        useTranslationsData().value = initialData.value[3];

    }
    return initialData.value
}

async function setFilters(lang) {
    // Get all filters
    let allFilters = useFiltersData();
    let {data, error} = await getAllFilters(lang);
    if (!error.value) allFilters.value = data.value;
    return data.value
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const locale = ref(nuxtApp.$i18n.locale?.effect?.fn());

    let addedRoads = {[locale.value]: true}

    // await setFilters(locale.value)
    // await setInitialData(locale.value)

    // // called right after a new locale has been set
    // nuxtApp.hook('i18n:localeSwitched', async ({oldLocale, newLocale})  => {
    //     // console.log('onLanguageSwitched', oldLocale, newLocale)
    //     await setFilters(newLocale)
    //     await setInitialData(newLocale)
    //
    //     locale.value = newLocale;
    //     if (!addedRoads[newLocale]) {
    //         addedRoads[newLocale] = true
    //         await setRouts()
    //     }
    // })



    // nuxtApp.hook('app:created', async ({oldLocale, newLocale})  => {
    //
    // })
    //
    const filters = await setFilters(locale.value)
    const initialData = await setInitialData(locale.value)
    const types = initialData[2]


    const {data, error} = await getDressRedirects(locale.value)
    if (error.value) return
    // console.log(data.value);
    // Adding default product redirects
    types.forEach(productType => {
        const type = productType.slug;

        filters.forEach(filterProduct => {
            const filter = filterProduct.uid
            filterProduct.data.forEach(filterItem => {
                const filterValue = filterItem.attributes.slug
                let from = '/' + type + '?' + filter + '=' + filterValue
                let to = '/' + type + '/' + filter + '/' + filterValue

                if (locale.value !== 'en') {
                    from = '/' + locale.value + from
                    to = '/' + locale.value + to
                }


                data.value.push({
                    name: (to + '___' + locale.value).replaceAll('/', '_'),
                    from,
                    to,
                    locale: locale.value,
                    meta: {
                        slug: type,
                        query: convertPathToQueryObject(from),
                    }
                })
            })
        })
    })


    const router = useRouter()
    let routesFrom = []


    data.value.forEach(newRoute => {
        routesFrom.push(newRoute.from)

        router.addRoute({
            name: (newRoute.name + '___' + newRoute.locale).replaceAll('/', '_'), // + '___' + newRoute.locale,
            path: newRoute.to,
            component: () => Discover,
            meta: setMeta(newRoute)
        })
    })


    router.afterEach((route) => {
        // console.log({route});
        const fullPath = route.fullPath;
        if (routesFrom.includes(fullPath)) {
            const index = data.value.findIndex(d => d.from === fullPath)
            if (is_server()) {
                navigateTo(data.value[index].to, {
                    redirectCode: 301
                })
            } else {
                route.meta = setMeta(data.value[index])
                window.history.replaceState(window.history.state, '', data.value[index].to)
            }
        }
    })

    // await setRouts()
    //
    //
    // async function setRouts() {
    //
    // }


})

function setMeta(newRoute) {
    return {
        slug: newRoute.meta.slug,
        title: newRoute.meta.title,
        description: newRoute.meta.description,
        h1: newRoute.meta.h1,
        query: newRoute.meta.query,
        seoText: newRoute.meta.seoText
    }
}

function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
