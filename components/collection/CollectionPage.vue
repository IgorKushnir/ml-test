<template>
  <div>

    <Seo :data="dataCollection" :breadcrumbs="[
        {
          title: $t('collections'),
          path: '/collections'
        },
        {
          title: dataCollection?.title
        }
    ]"
         :pathToPage="{en: 'collections', pl: 'kolekcja'}"
         :localizations="dataCollection?.localizations?.data"
         :blockRobots="filterSelected?.length > 0"
    />
    <transition name="fade">

      <div v-if="!pendingCollection && dataCollection != null">
        <InnerHeader 
          :title="dataCollection?.title" 
          :sub_header="dataCollection?.line?.data?.attributes?.title"
          :sub_title="dataCollection?.description"/>
        <StickyBarStickyHeaderMilla
            :back="(router.options?.history?.state?.back === '/collections' || router.options?.history?.state?.back === '/kolekcje')"
            :title="dataCollection?.title"
        >
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
            {{item.value}} <span class="icon-close-16"/>
          </div>
        </TagContainer>
        <ProductGrid
            :products-data="dataProducts"
            :pending-products="pendingProducts"
            :promo="dataCollection?.show_promo"
            @load="page => filterData(selectedFilters, page)"
            @click="handleProductClick"
            infinite
            :shimmerItems="0"
        >
          <template #promo>
            <div class="col-8 col-12-lg"
                 v-if="dataCollection?.show_promo && dataCollection?.cover_4x3?.data != null && filterSelected?.length === 0"
            >
              <div class="promo" v-if="dataCollection?.show_promo">
                <Image v-if="dataCollection?.video?.data !== null" class="video" :path="dataCollection.video" :alt="dataCollection?.title" :poster="dataCollection?.cover_3x4" />
                <Image v-else :path="dataCollection?.cover_4x3" :alt="dataCollection?.title"/>
              </div>
            </div>
          </template>
          <template #fact>
            <div v-if="dataCollection?.fact !== null && filterSelected?.length === 0" :class="(dataCollection.fact?.ratio === 'vertical' ?  'col-4'  : 'col-8') + ' col-6-lg col-12-lg new-ratio-16x9-md'">
              <Fact :data="dataCollection.fact"/>
            </div>
          </template>
        </ProductGrid>
      </div>
    </transition>
    <PageNotFound  :show="dataCollection === null"/>
  </div>
</template>
<script setup lang="js">
import getCollection from '~/api/getCollection'
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'
import getAllFilters from "~/api/getAllFilters"

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;
let filterSelected = ref([])
const filtersIsFetching = ref(true)
const dataAllFilters = ref([])
const selectedFilters = ref(parseQuery() ?? [])
let initialData = ref([])
const productPage = ref(1)
const pages = ref(1)

const { locale } = useI18n()

const displayFilters = ref(parseQuery().map(filter => 
filter.values.map(value => 
({
  key: filter.key,
  value: value
})
)
).flat() ?? []
)

const handleProductClick = () => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem('collection', slug)
}

const previousPages = router.options.history?.pages?.[slug]
router.options.history.pages = {}
router.options.history.pages[slug] = previousPages;
pages.value = previousPages ?? 1;

const {
  data: dataCollection,
  pending: pendingCollection,
} = await getCollection(slug, locale.value)

const alignFiltersWithQueryParams = (filtersData, selectedFilters) => filtersData.map(filter => {
  const currentRouteFilter = selectedFilters.find((routeFilter) =>  routeFilter.uid === filter.uid)
  if (currentRouteFilter) {
    return {...filter, data: filter.data.map(({attributes}) => ({attributes: {slug: attributes.slug, title: attrinbutes.title, value: currentRouteFilter.values.includes(attributes.slug)}}))}
  }
  return {...filter, data: filter.data.map(({attributes}) => ({attributes: {...attributes, value: false}}))}
})

const {data} = await getAllFilters(locale.value);
dataAllFilters.value = alignFiltersWithQueryParams(data.value, selectedFilters.value)


const filters = ref([{
  key: 'collection',
  values: [slug]
}])

const {
  data: dataAvailableFilters,
  pending: pendingFilters,
} = await useAsyncData('data_activeFilters', () => getActiveFilters({filters: [...[{
  key: 'collection',
  values: [slug]
}], ...selectedFilters.value], lang: locale.value, type: null, fetchFilters: filtersIsFetching.value}), {
  transform: (d) => {
    return d.data['products']['meta']
  },
})


const {
  data: dataProducts,
  pending: pendingProducts,
} = await useLazyAsyncData('data_collection_products', () => getProducts({filters: [...[{
  key: 'collection',
  values: [slug]
}], ...selectedFilters.value], lang: locale.value, type: null, page: productPage.value, pages: pages.value }), {
  transform: (d) => {
    const collection = 'products';
    let initialPageSize = 12;
    pages.value = 1;

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
    initialData.value.push(...d.data[collection].data.map(product => ({...product, attributes: {...product.attributes, slug: `${product.attributes.slug}`}})))

    d.data[collection].data = initialData.value;

    return d.data[collection]
  },
})

onMounted(() => {
  initialData.value = dataProducts.value?.data ?? []
})

async function filterData(e, page) {
  productPage.value = page;
  selectedFilters.value = e;

  router.options.history.pages[slug] = page

  refreshNuxtData('data_collection_products').then(_ => {
    if (page === 1) {
      window.scroll({top: 0})
    }
  }).catch(e => console.error(e))

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
    query: filters.reduce((acc, item) => ({...acc, [item.key]: item.values.join(',')}), {}),
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
.promo {
  height: 100%;
  position: relative;
  .video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.promo * {
  height: 100%;
  position: relative;
}
@include lg {
  .promo {
    padding-top: 66%;
    * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
