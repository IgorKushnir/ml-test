<template>
  <div>
    <InnerHeader :title="slug"/>

    <StickyHeader>
      <template #center>
        <StickyMenu :data="typeData" path="/discover/" class="grid-column-center"/>
      </template>

      <template #end>
        <Filter
            v-if="dataAvailableFilters !== null"
            :available-filters="dataAvailableFilters"
            @filters="e => handleFilter(e)"
            @check-filters="e => checkFiltersHandler(e)"
            :pending="pendingFilters"
        />
      </template>
    </StickyHeader>

      <ProductGrid
          v-if="dataProducts!== null"
          :products-data="dataProducts"
          :pending-products="pendingProducts"
          :grid="4"
          infinite
          @load="page => filterData(currentFilters, page)"
      />

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
let slug = route.params.slug;
let filterSelected = ref([])
let filters = ref([])

// let dataProducts = {}
let {
  data: dataProducts,
  pending: pendingProducts,
  refresh: refreshProducts,
  error: errorProducts
} = await getProducts({filters: filters.value, lang: 'en', type: slug, page: 1});
let {
  data: dataAvailableFilters,
  pending: pendingFilters,
  refresh: refreshAvailableFilters,
  error: errorAvailableFilters
} = await getActiveFilters({filters: filters.value, lang: 'en', type: slug, fetchFilters: true});


onMounted(() => {
  refreshProducts();
  refreshAvailableFilters()
})


let currentFilters =  ref([])
async function filterData(e, page) {
  currentFilters.value = e;
  let f = [...filters.value];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...filters.value, ...newFilters];
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
  let f = [...filters.value];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...filters.value, ...newFilters];
  }

  pendingFilters.value = true;
  const {data, pending, refresh, error} = await getActiveFilters({filters: f, lang: 'en', type: slug, fetchFilters: false});

  refresh()

  watch(() => pending.value, (p) => {
    dataAvailableFilters.value = data.value;
    pendingFilters.value = pending.value;
  })
}

function handleFilter(e) {
  pendingProducts.value = true
  dataProducts.value.data = []
  filterData(e, 1)
}

</script>

<style scoped lang="scss">


</style>
