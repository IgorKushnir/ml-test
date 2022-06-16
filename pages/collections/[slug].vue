<template>
  <div>
    <div v-if="!pendingCollection && dataCollection != null">


      <InnerHeader :title="dataCollection.title" :sub_header="dataCollection.line.data.attributes.title"
                   :sub_title="dataCollection.description"/>

      <StickyHeader :title="dataCollection.title">
        <template #end>
          <Filter
              :available-filters="dataAvailableFilters"
              @filters="e => filterData(e, 1)"
              @check-filters="e => checkFiltersHandler(e)"
              :pending="pendingFilters"
          />
        </template>
      </StickyHeader>

<!--      {{ filterSelected }}-->


      <ProductGrid
          :products-data="dataProducts"
          :pending-products="pendingProducts"
          :promo="dataCollection.show_promo"
          @load="page => filterData(currentFilters, page)"
          infinite
      >
        <template #promo>
          <div class="col-8 col-12-md"
               v-if="dataCollection.show_promo && dataCollection.cover_4x3.data != null && filterSelected.length === 0"
          >
            <div class="promo" v-if="dataCollection.show_promo">
              <Image :path="dataCollection.cover_4x3" :alt="dataCollection.title"/>
              <video
                  v-if="dataCollection.video.data != null"
                  playsinline=""
                  :src="$getAbsoluteUrl(dataCollection.video.data.attributes.url)"
                  loop="loop"
                  tabindex="-1"
                  muted autoplay aria-hidden="true"
              >
              </video>
            </div>
          </div>
        </template>
        <template #fact>

          <div v-if="dataCollection.fact !== null && filterSelected.length === 0"
               class="col-8 col-6-lg col-12-md">
                        <Fact :title="dataCollection.fact.title" :text="dataCollection.fact.text" />
          </div>
        </template>

      </ProductGrid>

    </div>

    <PageNotFound  :show="dataCollection === null"/>

  </div>
</template>

<script setup lang="ts">
import getCollection from '~/api/getCollection'
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'

const {$getAbsoluteUrl} = useNuxtApp();

const route = useRoute();
let slug = route.params.slug;
let filterSelected = ref([])

let filters = ref([{
  key: 'collection',
  values: [slug]
}])
const {
  data: dataCollection,
  pending: pendingCollection,
  refresh: refreshCollection,
  error: errorCollection
} = await getCollection(slug, 'en')
let {
  data: dataProducts,
  pending: pendingProducts,
  refresh: refreshProducts,
  error: errorProducts
} = await getProducts({filters: filters.value, lang: 'en', type: 'dress', page: 1});
let {
  data: dataAvailableFilters,
  pending: pendingFilters,
  refresh: refreshAvailableFilters,
  error: errorAvailableFilters
} = await getActiveFilters({filters: filters.value, lang: 'en', type: 'dress'});


onMounted(() => {
  refreshCollection();
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
  const {data, pending, refresh, error} = await getProducts({filters: f, lang: 'en', type: 'dress', page: page});

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

    console.log(dataProducts.value.meta.pagination);
  })
}

async function checkFiltersHandler(e) {
  let f = [...filters.value];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...filters.value, ...newFilters];
  }

  pendingFilters.value = true;
  const {data, pending, refresh, error} = await getActiveFilters({filters: f, lang: 'en', type: 'dress'});

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
