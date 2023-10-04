import { defineNuxtPlugin } from '#app'
import {getDressRedirects, generateRandomID, convertPathToQueryObject} from "~/api/getDressRedirects";
import {useFiltersData, useTypesData, useMenuData, useTranslationsData} from "~/composables/states";
import getAllFilters from '~/api/getAllFilters'
import getInitialData from '~/api/getInitialData';


const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})
async function setInitialData() {
    // get Initial data (Menu, Lines, Types)
    let {data: initialData, error: initialError} = await getInitialData('en');
    if (!initialError.value) {
        useMenuData().value = [initialData.value[0], initialData.value[1]]
        useTypesData().value = initialData.value[2];
        useTranslationsData().value = initialData.value[3];
    }
    return initialData.value
}
async function setFilters() {
    // Get all filters
    let allFilters = useFiltersData();
    let {data, pending, refresh, error} = await getAllFilters('en');
    if (!error.value) allFilters.value = data.value;
    return data.value
}
export default defineNuxtPlugin(async (nuxtApp) => {


    const filters = await setFilters()
    const initialData = await setInitialData()
    const types = initialData[2]

    const { data, pending, refresh, error } = await getDressRedirects()
    if (error.value) return

    const router = useRouter()
    let routesFrom = []



    // Adding default product redirects
    types.forEach(productType => {
        const type = productType.slug;

        filters.forEach(filterProduct => {
            const filter = filterProduct.uid
            filterProduct.data.forEach(filterItem => {
                const filterValue = filterItem.attributes.slug
                const from = '/'+type+'?'+filter+'='+filterValue
                const to = '/'+type+'/'+filter+'/'+filterValue


                data.value.push({
                    name: generateRandomID(),
                    from,
                    to,
                    meta: {
                        slug: type,
                        query: convertPathToQueryObject(from),
                    }
                })
            })
        })
    })

    // console.log(data.value);
    // console.log(data.value);

    data.value.forEach(newRoute => {
        routesFrom.push(newRoute.from)

        router.addRoute({
            name: newRoute.name,
            path: newRoute.to,
            component: () => Discover,
            meta: setMeta(newRoute)
        })
    })


    router.afterEach((route) => {
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

})
function setMeta(newRoute) {
    return {
        slug: newRoute.meta.slug,
        title:newRoute.meta.title,
        description: newRoute.meta.description,
        h1: newRoute.meta.h1,
        query: newRoute.meta.query,
        seoText: newRoute.meta.seoText
    }
}
function is_server() {
    return !(typeof window != 'undefined' && window.document);
}
