import {defineNuxtPlugin} from '#app'
import {getDressRedirects, convertPathToQueryObject} from "~/api/getDressRedirects";
import getAllFilters from '~/api/getAllFilters'
import getInitialData from '~/api/getInitialData';


const Discover = import('~/components/Discover.vue').then(r => {
    return r.default || r
})

async function setInitialData(lang) {
    // get Initial data (Menu, Lines, Types)
    let {data: initialData, error: initialError} = await getInitialData(lang);
    // if (!initialError.value) {
    //     useMenuData().value = [initialData.value[0], initialData.value[1]]
    //     useTypesData().value = initialData.value[2];
    //     useTranslationsData().value = initialData.value[3];
    //
    // }

    return initialData.value
}

async function setFilters(lang) {
    // Get all filters
    let {data, error} = await getAllFilters(lang);
    // let allFilters = useFiltersData();
    // if (!error.value) allFilters.value = data.value;
    return data.value
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const locale = ref(nuxtApp.$i18n.locale?.effect?.fn());


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

        // Replace to poland translation slug
        let to = newRoute.to
        if (locale.value === 'pl') {
            to = replacePathToPlLang(to)
        }
        router.addRoute({
            name: (newRoute.name + '___' + newRoute.locale).replaceAll('/', '_'), // + '___' + newRoute.locale,
            path: to,
            component: () => Discover,
            meta: setMeta(newRoute)
        })
    })



    router.afterEach((route) => {
        const fullPath = route.fullPath;
        if (routesFrom.includes(fullPath)) {
            const index = data.value.findIndex(d => d.from === fullPath)

            let to = data.value[index].to

            // Replace to poland translation slug
            if (locale.value === 'pl') {
                to = replacePathToPlLang(to)
            }

            if (is_server()) {
                navigateTo(to, {
                    redirectCode: 301
                })
            } else {
                route.meta = setMeta(data.value[index])
                window.history.replaceState(window.history.state, '', to)
            }
        }
    })

})
const polandSlugTranslations = {
    silhouettes: "silhouette",
    colors: "kolor",
    lines: "linia",
    styles: "styl",
    necklines: "dekolt",
    decorations: "dekor",
    others: "inni",
    budgets: "budzet",
    backnecklines: "dekolt-z-tylu",
    accessoires: "akcesoria",
    shoes: "shoes",
}
function replacePathToPlLang(path) {
    let to = path
    Object.keys(polandSlugTranslations).forEach(key => {
        to = to.replaceAll(key, polandSlugTranslations[key])
    })
    return to;
}

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
