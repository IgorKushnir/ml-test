<template>
  <div>
    <div v-if="dataProducts!== null">
      <InnerHeader :title="route.meta?.h1 ?? type.title"/>

      <StickyBarStickyHeaderMilla>
        <template #center>
          <StickyBarStickyMenu :data="typeData" path="/" class="grid-column-center"/>
        </template>
        <template #end>
          <Filter
              v-if="dataAvailableFilters !== null"
              :available-filters="dataAvailableFilters"
              :all-filters="dataAllFilters"
              @filters="e => handleFilter(e)"
              @check-filters="e => checkFiltersHandler(e)"
              :pending="pendingFilters"
              :initialFilterSelected="selectedFilters"
              :pendingInitial="pendingFilters && dataAvailableFilters === null"
          />
        </template>
      </StickyBarStickyHeaderMilla>

      <TagContainer class="hide-md">
        <div
            v-for="(item) in displayFilters"
            class="selected-item"
            v-on:click="cutOneFilter(item)"
        >
          {{ item.value }} <span class="icon-close-16"/>
        </div>

      </TagContainer>


      <ProductGrid
          :products-data="dataProducts"
          :pending-products="pendingProducts"
          :grid="4"
          infinite
          @load="page => filterData(selectedFilters, page)"
          :shimmer-items="4"
      />
    </div>

    <!--    <Loading :pending="pendingProducts"/>-->
    <PageNotFound :show="dataProducts == null && !pendingProducts"/>


    <Seo :data="route.meta?.title ? null : type"
         :breadcrumbs="[
        {
          title: route.meta?.title ?? type?.title,
        }
    ]"
         :title="route.meta?.title ?? type?.title"
         :description="route.meta?.description"
         :blockRobots="((route.path === localePath('/'+type.slug) && filterSelected?.length > 0) || (route.path !== localePath('/'+type.slug) && route.meta.title == null))"
         :seoText="route.meta?.seoText"
         :localizations="route.meta.localizations ?? type.localizations.data"
    />
    <ScrollToTopButton v-show="showScrollButton" />
  </div>
</template>

<script setup lang="js">
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'
import getAllFilters from "~/api/getAllFilters"
import {useTypesData} from "~/composables/states";
import { onMounted } from 'vue';

const { find } = useStrapi()
const typeData = useTypesData()
const route = useRoute();
const router = useRouter();
const { locale } = useI18n()
const localePath = useLocalePath()
const topProductIds = ref([])
const productPage = ref(1)
const pages = ref(1)
const filtersIsFetching = ref(true)
const dataAllFilters = ref([])
const selectedFilters = ref(parseQuery() ?? [])
let initialData = ref([])
const showScrollButton = ref(false)

onMounted(() => {
  document.addEventListener('scroll', function (e) {
    showScrollButton.value = window.scrollY > window.innerHeight;
  }, {passive: true});
})

const displayFilters = ref(parseQuery().map(filter => 
filter.values.map(value => 
({
  key: filter.key,
  value: value
})
)
).flat() ?? []
)

const type = computed(() => typeData.value.find(e => e.slug === slug))
let slug = route.meta.slug ?? route.params.slug; //  from router.option.ts
let filterSelected = ref([])
let filters = ref([]);

const previousPages = router.options.history?.pages?.[slug]
router.options.history.pages = {}
router.options.history.pages[slug] = previousPages;

pages.value = previousPages ?? 1;

// Get topProducts ids
try {
  const {data} = await find('product-setting', {
    populate: "topProducts",
    locale: locale.value
  })

  if (data?.attributes?.topProducts?.data) {
    topProductIds.value = data.attributes.topProducts.data.map(e => e.id)
  }
} catch (e) {
  console.error(e);
}

const {data, refresh} = await getAllFilters(locale.value);

const processRouteFilters = (filterData) => filterData.map(filter => {
  const currentRouteFilter = selectedFilters.value.find((routeFilter) =>  routeFilter.uid === filter.uid)
  if (currentRouteFilter) {
    return {...filter, data: filter.data.map(({attributes}) => ({attributes: {slug: attributes.slug, title: attributes.title, value: currentRouteFilter.values.includes(attributes.slug)}}))}
  }
  return {...filter, data: filter.data.map(({attributes}) => ({attributes: {...attributes, value: false}}))}
})

dataAllFilters.value = processRouteFilters(data.value)

let {
  data: dataAvailableFilters,
  pending: pendingFilters,
} = await useLazyAsyncData('data_activeFilters', () => getActiveFilters({
  filters: selectedFilters.value,
  lang: locale.value,
  type: type.value.slug,
  fetchFilters: filtersIsFetching.value
}), {
  transform: (d) => {
    return d.data['products']['meta']
  },
})

let {
  data: dataProducts,
  pending: pendingProducts,
} = await useLazyAsyncData('data_products', () => getProducts({
  filters: selectedFilters.value,
  lang: locale.value,
  type: slug,
  page: productPage.value,
  pages: pages.value,
  topProducts: selectedFilters.value?.length > 0 ? null : [topProductIds.value] // Is the query without filter -> extrude top products
}), {
  transform: (d) => {
    const collection = 'products';

    let initialPageSize = 12;
    pages.value = 1;

    // Add Top products
    if (d.data?.topProducts?.data?.length > 0) {

      // order top products
      d.data.topProducts.data = d.data.topProducts.data.sort((a, b) => topProductIds.value.indexOf(parseInt(a.id)) - topProductIds.value.indexOf(parseInt(b.id)))

      d.data[collection].data = [...d.data.topProducts.data, ...d.data[collection].data]
    }

    const p = router.options.history?.pages?.[slug];
    if (p) {
      d.data[collection].meta.pagination.EDITED = true
      d.data[collection].meta.pagination.pageCount = Math.ceil(d.data[collection].meta.pagination.total / initialPageSize)
      d.data[collection].meta.pagination.page = p
      d.data[collection].meta.pagination.pageSize = initialPageSize
    }


    if (productPage.value === 1 || pages.value !== 1) {
      initialData.value = []
    }
    initialData.value.push(...d.data[collection].data)

    d.data[collection].data = initialData.value;

    return d.data[collection]
  },
})


onMounted(() => {
  initialData.value = dataProducts.value?.data ?? []
})

watch(type.value, () => {
  productPage.value = 1;
  
  router.options.history.pages[type.value.slug] = 1;
  pendingProducts.value = true
  dataProducts.value.data = []
  refreshNuxtData('data_products').then(() => {
      window.scroll({top: 0})
  })
  refreshNuxtData('data_activeFilters')
 const data = refresh()
  
dataAllFilters.value = processRouteFilters(data.value)
})

async function filterData(e, page) {
  productPage.value = page;

  selectedFilters.value = e;

  router.options.history.pages[slug] = page

  refreshNuxtData('data_products').then(_ => {
    if (page === 1) {
      window.scroll({top: 0})
    }
  })
refreshNuxtData('data_activeFilters')
}

async function checkFiltersHandler(e) {
  const processedSelectedFilters = selectedFilters.value
  .map(filter => {
    if (!e.some(eventFilter => eventFilter.key === filter.key)) {
      return filter
    }
    
    return {
      key: filter.key,
      values: e.find(eventFilter => eventFilter.key === filter.key).values
    }
  })
  .filter(filter => filter.values.length > 0)

  const processedEventFilters = e
  .filter(eventFilter => !selectedFilters.value
    .some((filter) => filter.key === eventFilter.key))
  .filter(filter => filter.values.length > 0)

  const processedFilters = [...processedSelectedFilters, ...processedEventFilters]

  selectedFilters.value = processedFilters
  displayFilters.value = processedFilters
    .map(filter => 
      filter.values.map(value => 
       ({
        key: filter.key,
        value: value
      })
    )
    )
    .flat()
  filtersIsFetching.value = true;

  refreshNuxtData('data_activeFilters')
}

function setQuery(filters) {
  router.replace({
    query: filters.reduce((acc, item) => ({...acc, ...(item.values?.length > 0 ? {[item.key]: item.values.join(',')} : null)}), {}),
    path: localePath('/' + slug)
  })
}

function parseQuery() {
  const query = route.meta.query ?? route.query; //
  let queryKeys = Object.keys(query);

  return queryKeys.map(key => {
    return {
      key: key,
      values: query[key] === '' ? [] : query[key]?.split(',') ?? []
    }
  }) ?? []
}

function handleFilter(e) {
  setQuery(e);
  pendingProducts.value = true
  dataProducts.value.data = []
  filterData(e, 1)
}

function cutOneFilter(item) {
  const processedFilters = selectedFilters.value.map((filter) => {
  if (filter.key !== item.key) {
    return filter
  }
  return ({...filter, values: filter.values.filter((value) => value !== item.value)})
}).filter((filter) => filter.values.length > 0)

selectedFilters.value = processedFilters

displayFilters.value = processedFilters
  .map(filter => 
    filter.values.map(value => 
       ({
        key: filter.key,
        value: value
      })
    )
  )
  .flat()

  setQuery(selectedFilters.value)
  dataProducts.value.data = []
  filterData(selectedFilters.value, 1)
}
</script>

<style scoped lang="scss">


.selected-item {
  padding: 8px 10px 8px 12px;
  background-color: $gray;
  color: $white;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;

  .icon-close-16 {
    font-size: 11px;
    margin-left: 4px;
  }
}

</style>
