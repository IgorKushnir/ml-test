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
          {{ item.value }} <span class="icon-close-16"/>
        </div>

      </TagContainer>


      <ProductGrid
          :products-data="dataProducts"
          :pending-products="pendingProducts"
          :grid="4"
          infinite
          @load="page => filterData(currentFilters, page)"
      />
    </div>

    <!--    <Loading :pending="pendingProducts"/>-->
    <PageNotFound :show="dataProducts == null && !pendingProducts"/>


    <Seo :data="type"
         :breadcrumbs="[
        {
          title: route.meta?.title ?? type?.title,
        }
    ]"
         :title="route.meta?.title ?? type?.title"
         :description="route.meta?.description"
         :blockRobots="!(Object.keys(route.query).length === 0)"
         :seoText="route.meta?.seoText"
    />

  </div>
</template>

<script setup lang="js">
// import getCollection from '~/api/getCollection'
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'
import {useTypesData} from "~/composables/states";



const {$getAbsoluteUrl} = useNuxtApp();

const typeData = useTypesData()

const route = useRoute();
const router = useRouter();

const productPage = ref(1)
const pages = ref(1)
const fetchFilters = ref(true)


let slug = route.meta.slug ?? route.params.slug; //  from router.option.ts
let filterSelected = ref([])
let filters = ref([]);

const previousPages = router.options.history?.pages?.[slug]
router.options.history.pages = {}
router.options.history.pages[slug] = previousPages;
// console.log({previousPages});

pages.value = previousPages ?? 1;


let {
  data: dataAvailableFilters,
  pending: pendingFilters,
} = await useAsyncData('data_activeFilters', () => getActiveFilters({
  filters: filters.value,
  lang: 'en',
  type: slug,
  fetchFilters: fetchFilters.value
}), {
  transform: (d) => {
    return d.data['products']['meta']
  },
})
let initialAvailableFilters = [];


const initialFilters = ref([]);
initialAvailableFilters = dataAvailableFilters.value;

initialFilters.value = parseQuery();

// redirect
// if (props.redirectData?.filter) initialFilters.value.push(props.redirectData?.filter)

initialFilters.value.forEach(item => {
  item.values.forEach(it => {
    filterSelected.value.push({
      key: item.key,
      value: it
    })
  })
})
filters.value = [...filters.value, ...initialFilters.value];


const type = computed(() => typeData.value.find(e => e.slug === slug))


let initialData = ref([])
let {
  data: dataProducts,
  pending: pendingProducts,
} = await useLazyAsyncData('data_products', () => getProducts({
  filters: filters.value,
  lang: 'en',
  type: slug,
  page: productPage.value,
  pages: pages.value
}), {
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
    initialData.value.push(...d.data[collection].data)

    d.data[collection].data = initialData.value;

    return d.data[collection]
  },
})


onMounted(() => {
  initialData.value = dataProducts.value?.data ?? []
})


let currentFilters = ref(initialFilters.value)

async function filterData(e, page) {
  // console.log('-------');

  productPage.value = page;
  // console.log('page--: ',page);


  // // Get selected filters in one array
  let selected = []

  filters.value.forEach(f => f.values.forEach(item => {
    selected.push({
      key: f.key,
      value: item
    })
  }))

  // console.log(filters.value);
  // Filter query by list of allows
  let allowQuery = Object.keys(initialAvailableFilters.filters ?? {});
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
    e.forEach(eF => {
      const index = f.findIndex(fF => eF.key === fF.key)
      if (index !== -1) {
        f[index] = eF
      } else {
        f.push(eF)
      }
    })
    f = f.filter(d => d.values.length > 0)
  }
  pendingFilters.value = true;
  fetchFilters.value = false
  filters.value = f
  refreshNuxtData('data_activeFilters')

}

function setQuery(filters) {
  const query = {}
  let allowQuery = Object.keys(initialAvailableFilters.filters ?? {});
  filters.forEach(q => {
    if (allowQuery.includes(q.key)) { // Filter query by list of allows
      query[q.key] = q.values.join(',');
      if (query[q.key] === '') {
        delete query[q.key];
      }
    }
  })

  router.replace({
    query: query,
    path: '/' + slug
  })

}

function parseQuery() {
  const query = route.meta.query ?? route.query; //
  let queryKeys = Object.keys(query);

  // console.log(dataAvailableFilters.value.filters, '0');

  // Filter query by list of allows
  let allowQuery = Object.keys(initialAvailableFilters?.filters ?? {});
  queryKeys = queryKeys.filter((k) => allowQuery.includes(k))


  return queryKeys.map(key => {
    return {
      key: key,
      values: query[key] === '' ? [] : query[key]?.split(',') ?? []
    }
  })
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
  // console.log({filterToRemove});

  const index1 = filters.value.findIndex((f) => f.key === filterToRemove.key);
  if (index1 !== -1) {
    const index2 = filters.value[index1].values.findIndex((f) => f === filterToRemove.value)
    if (index2 !== -1) {
      filters.value[index1].values.splice(index2, 1)
      if (filters.value[index1].values.length === 0) {
        filters.value.splice(index1, 1)
      }
    }
  }

  // selected filters
  const _filters = [];
  filterSelected.value.forEach(filter => {
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

</style>
