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
                @filters="e => handleFilter(e)"
                @check-filters="e => checkFiltersHandler(e)"
                :pending="pendingFilters"
                :initialFilterSelected="initialFilters"
                :pendingInitial="pendingFilters && dataAvailableFilters === null"
            />
          </template>
        </StickyBarStickyHeaderMilla>
        <TagContainer class="hide-md">
          <div
              v-for="(item, index) in filterSelected"
              class="selected-item"
              v-on:click="cutOneFilter(index)"
          >
            {{item.value}} <span class="icon-close-16"/>
          </div>
        </TagContainer>
        <ProductGrid
            :products-data="dataProducts"
            :pending-products="pendingProducts"
            :promo="dataCollection?.show_promo"
            @load="page => filterData(filters, page)"
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

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;
let filterSelected = ref([])
const fetchFilters = ref(true)
const productPage = ref(1)
const pages = ref(1)

const { locale } = useI18n()

const previousPages = router.options.history?.pages?.[slug]
router.options.history.pages = {}
router.options.history.pages[slug] = previousPages;
pages.value = previousPages ?? 1;

const {
  data: dataCollection,
  pending: pendingCollection,
} = await getCollection(slug, locale.value)


const filters = ref([{
  key: 'collection',
  values: [slug]
}])

const {
  data: dataAvailableFilters,
  pending: pendingFilters,
} = await useAsyncData('data_activeFilters', () => getActiveFilters({filters: filters.value, lang: locale.value, type: null, fetchFilters: fetchFilters.value}), {
  transform: (d) => {
    return d.data['products']['meta']
  },
})

let initialAvailableFilters = {};
const initialFilters = ref([]);
// onMounted(() => {
  initialAvailableFilters = dataAvailableFilters.value ?? {};

  initialFilters.value = parseQuery();

  initialFilters.value?.forEach(item => {
    item.values?.forEach(it => {
      filterSelected.value.push({
        key: item.key,
        value: it
      })
    })
  })
  filters.value = [...filters.value, ...initialFilters.value];
// })

const initialData = ref([])

const {
  data: dataProducts,
  pending: pendingProducts,
} = await useLazyAsyncData('data_products', () => getProducts({filters: filters.value, lang: locale.value, type: null, page: productPage.value, pages: pages.value }), {
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
const currentFilters =  ref([])

async function filterData(e, page) {
  productPage.value = page;

  // // Get selected filters in one array
  let selected = []
  filters.value?.forEach(f => f.values?.forEach(item => {
    selected.push({
      key: f.key,
      value: item
    })
  }))

  // Filter query by list of allows
  const allowQuery = Object.keys(initialAvailableFilters.filters ?? {});
  selected = selected.filter((k) => allowQuery.includes(k.key))

  filterSelected.value = selected;

  router.options.history.pages[slug] = page

  refreshNuxtData('data_products').then(_ => {
    if (page === 1) {
      window.scroll({top: 0})
    }
  })

}

async function checkFiltersHandler(e) {
  let f = [...filters.value];
  if (e !== null) {
    e?.forEach(eF => {
      const index = f.findIndex(fF => eF.key === fF.key)
      if (index !== -1) {
        f[index] = eF
      } else {
        f.push(eF)
      }
    })
    f = f.filter(d => d.values?.length > 0)
  }
  pendingFilters.value = true;
  fetchFilters.value = false
  filters.value = f
  refreshNuxtData('data_activeFilters')
}

function setQuery(filters) {
  const query = {}
  let allowQuery = Object.keys(initialAvailableFilters.filters ?? {});
  filters?.forEach(q => {
    if (allowQuery.includes(q.key)) { // Filter query by list of allows
      query[q.key] = q.values.join(',');
      if (query[q.key] === '') {
        delete query[q.key];
      }
    }
  })

  router.replace({
    query: query,
  })
}

function parseQuery() {
  const query = route.query;
  let queryKeys = Object.keys(query);

  // Filter query by list of allows
  let allowQuery = Object.keys(initialAvailableFilters?.filters ?? {});
  queryKeys = queryKeys.filter((k) => allowQuery.includes(k))

  return queryKeys.map(key => ({
      key: key,
      values: query[key] === '' ? [] :query[key]?.split(',') ?? []
    })
  )
}

function handleFilter(e) {
  setQuery(e);
  pendingProducts.value = true
  dataProducts.value.data = []
  filterData(e, 1)
}

function cutOneFilter(index) {
  const filterToRemove = filterSelected.value[index]
  filterSelected.value.splice(index, 1)

  const index1 = filters.value.findIndex((f) => f.key === filterToRemove.key );
  if (index1 !== -1) {
    const index2 = filters.value[index1].values.findIndex((f) => f === filterToRemove.value )
    if (index2 !== -1) {
      filters.value[index1].values.splice(index2, 1)
      if (filters.value[index1].values?.length === 0) {
        filters.value.splice(index1, 1)
      }
    }
  }

  // selected filters
  const _filters = [];
  filterSelected.value?.forEach(filter => {
    const index = _filters.findIndex(i => i.key === filter.key)
    if (index === -1) {
      _filters.push({key: filter.key, values: [filter.value]});
    } else {
      _filters[index].values.push(filter.value)
    }
  })
  initialFilters.value = _filters;

  setQuery(filters.value)
  dataProducts.value.data = []
  filterData(filters.value, 1)
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
