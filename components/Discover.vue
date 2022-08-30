<template>
  <div>
    <Seo :data="type"/>
    <div v-if="dataProducts!== null">
      <InnerHeader :title="type.title"/>

      <StickyHeader>
        <template #center>
          <StickyMenu :data="typeData" path="/" class="grid-column-center"/>
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
      </StickyHeader>

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
          :grid="4"
          infinite
          @load="page => filterData(currentFilters, page)"
      />
    </div>

<!--    <Loading :pending="pendingProducts"/>-->
    <PageNotFound :show="dataProducts == null && !pendingProducts"/>


  </div>
</template>

<script setup lang="ts">
import getCollection from '~/api/getCollection'
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'
import {useTypesData} from "~/composables/states";

const {$getAbsoluteUrl} = useNuxtApp();

const typeData = useTypesData()

const route = useRoute();
const router = useRouter();

let slug = route.params.slug;
let filterSelected = ref([])
const initialFilters = ref(parseQuery());

initialFilters.value.forEach(item => {
  item.values.forEach(it => {
    filterSelected.value.push({
      key: item.key,
      value: it
    })
  })
})



const type = computed(() => typeData.value.find(e => e.slug === slug))



// let dataProducts = {}
let {
  data: dataProducts,
  pending: pendingProducts,
  refresh: refreshProducts,
  error: errorProducts
} = await getProducts({filters: initialFilters.value, lang: 'en', type: slug, page: 1, pages: router.options.history?.pages?.[slug]});
let {
  data: dataAvailableFilters,
  pending: pendingFilters,
  refresh: refreshAvailableFilters,
  error: errorAvailableFilters
} = await getActiveFilters({filters: [], lang: 'en', type: slug, fetchFilters: true});

onMounted(() => {
  // console.log(router.options.history?.pages);
  const previousPages = router.options.history?.pages?.[slug]
  router.options.history.pages = {}
  router.options.history.pages[slug] = previousPages;

  dataAvailableFilters.value = null;
  refreshProducts();
  refreshAvailableFilters()
})


let currentFilters =  ref([])
async function filterData(e, page) {
  currentFilters.value = e;
  let f = [];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...newFilters];
  }

  // Get selected filters in one array
  let selected = []
  e.forEach(f => f.values.forEach(item => {
    selected.push({
      key: f.key,
      value: item
    })
  }))
  filterSelected.value = selected;


  pendingProducts.value = true;
  const {data, pending, refresh, error} = await getProducts({filters: f, lang: 'en', type: slug, page: page});

  // set uploaded page to history
  router.options.history.pages[slug] = page

  refresh()

  watch(() => pending.value, (p) => {
    if (page === 1) {
      dataProducts.value = data.value;
      pendingProducts.value = pending.value;
    } else  {
      dataProducts.value.meta = data.value.meta;
      dataProducts.value.data = [...dataProducts.value.data, ...data.value.data];

      pendingProducts.value = pending.value;
    }

    // console.log(dataProducts.value.meta.pagination);
  })
}

async function checkFiltersHandler(e) {
  let f = [];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [ ...newFilters];
  }

  pendingFilters.value = true;
  const {data, pending, refresh, error} = await getActiveFilters({filters: f, lang: 'en', type: slug, fetchFilters: false});

  refresh()

  watch(() => pending.value, (p) => {
    dataAvailableFilters.value = data.value;
    pendingFilters.value = pending.value;
  })
}

function setQuery(filters) {
  const query = {}
  filters.forEach(q => {
    query[q.key] = q.values.join(',');
    if (query[q.key] === '') {
      delete query[q.key];
    }
  })
  router.replace({
    query: query,
  })
}

function parseQuery() {
  const query = route.query;
  const queryKeys = Object.keys(query);
  return queryKeys.map(key => {
    return {
      key: key,
      values: query[key] === '' ? [] :query[key]?.split(',') ?? []
    }
  })
}


function handleFilter(e) {
  setQuery(e);
  // console.log(e);

  pendingProducts.value = true
  dataProducts.value.data = []
  filterData(e, 1)
}

function cutOneFilter(index) {
  filterSelected.value.splice(index, 1)
  const filters = [];
  filterSelected.value.forEach(filter => {
    const index = filters.findIndex(i => i.key === filter.key)
    if (index === -1) {
      filters.push({key: filter.key, values: [filter.value]});
    } else {
      filters[index].values.push(filter.value)
    }

  })
  initialFilters.value = filters;
  setQuery(filters)

  pendingProducts.value = true
  dataProducts.value.data = []
  filterData(filters, 1)
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
