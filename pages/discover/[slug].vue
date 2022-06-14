<template>
  <div>

    <div>
      <InnerHeader :title="slug"/>

      <StickyHeader>
        <template #center>
          <StickyMenu :data="typeData" path="/discover/" class="grid-column-center"/>
        </template>

        <template #end>
          <Filter
              :available-filters="dataAvailableFilters"
              @filters="e => filterData(e)"
              @check-filters="e => checkFiltersHandler(e)"
              :pending="pendingFilters"
          />
        </template>
      </StickyHeader>

      <Container v-if="!pendingProducts && dataProducts != null">
        <ProductGrid :products-data="dataProducts.data" :pending-products="pendingProducts" :grid="4" />
      </Container>

    </div>

    <Loading v-if="pendingProducts"/>
    <PageNotFound v-if="dataProducts === null"/>

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

let {
  data: dataProducts,
  pending: pendingProducts,
  refresh: refreshProducts,
  error: errorProducts
} = await getProducts({filters: filters.value, lang: 'en', type: slug});
let {
  data: dataAvailableFilters,
  pending: pendingFilters,
  refresh: refreshAvailableFilters,
  error: errorAvailableFilters
} = await getActiveFilters({filters: filters.value, lang: 'en', type: slug});


onMounted(() => {
  refreshProducts();
  refreshAvailableFilters()
})


async function filterData(e) {
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
  const {data, pending, refresh, error} = await getProducts({filters: f, lang: 'en', type: slug});

  refresh()

  watch(() => pending.value, (p) => {
    dataProducts.value = data.value;
    pendingProducts.value = pending.value;
  })
}

async function checkFiltersHandler(e) {
  let f = [...filters.value];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...filters.value, ...newFilters];
  }

  pendingFilters.value = true;
  const {data, pending, refresh, error} = await getActiveFilters({filters: f, lang: 'en', type: slug});

  refresh()

  watch(() => pending.value, (p) => {
    dataAvailableFilters.value = data.value;
    pendingFilters.value = pending.value;
  })
}

</script>

<style scoped lang="scss">
.promo {
  height: 100%;
  position: relative;

  video {
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


</style>
