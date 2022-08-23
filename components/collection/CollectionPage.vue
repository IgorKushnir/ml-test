<template>
  <div>

    <Seo :data="dataCollection"/>
    <transition name="fade">
      <div v-if="!pendingCollection && dataCollection != null">


        <InnerHeader :title="dataCollection.title" :sub_header="dataCollection.line.data.attributes.title"
                     :sub_title="dataCollection.description"/>

        <StickyHeader
            :back="router.options?.history?.state?.back === '/collections'"
            :title="dataCollection.title"
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
        </StickyHeader>

        <!--      {{ filterSelected }}-->
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
            :promo="dataCollection.show_promo"
            @load="page => filterData(currentFilters, page)"
            infinite
        >
          <template #promo>
            <div class="col-8 col-12-lg"
                 v-if="dataCollection.show_promo && dataCollection.cover_4x3.data != null && filterSelected.length === 0"
            >
              <div class="promo" v-if="dataCollection.show_promo">
                <Image :path="dataCollection.cover_4x3" :alt="dataCollection.title"/>
                <Image v-if="dataCollection.video.data != null" class="video" :path="dataCollection.video" :alt="dataCollection.title"/>
              </div>
            </div>
          </template>
          <template #fact>
            <div v-if="dataCollection.fact !== null && filterSelected.length === 0" :class="(dataCollection.fact.ratio === 'vertical' ?  'col-4'  : 'col-8') + ' col-6-lg col-12-lg new-ratio-16x9-md'">
              <Fact :data="dataCollection.fact"/>
            </div>
          </template>

        </ProductGrid>

      </div>
    </transition>

<!--    <Loading :pending="pendingProducts"/>-->
    <PageNotFound  :show="dataCollection === null"/>

  </div>
</template>

<script setup lang="ts">
import getCollection from '~/api/getCollection'
import getProducts from '~/api/getProducts'
import getActiveFilters from '~/api/getActiveFilters'
import {useCashData} from "~/composables/states";

const {$getAbsoluteUrl} = useNuxtApp();


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
} = await getProducts({filters: [...filters.value, ...initialFilters.value], lang: 'en', type: 'dress', page: 1,
  pages: router.options.history?.pages?.[slug]
});
let {
  data: dataAvailableFilters,
  pending: pendingFilters,
  refresh: refreshAvailableFilters,
  error: errorAvailableFilters
} = await getActiveFilters({filters: filters.value, lang: 'en', type: 'dress', fetchFilters: true});

let test = ref();
onMounted(() => {
  // console.log(router.options.history?.pages?.[slug]);
  router.options.history.pages = {}

  dataAvailableFilters.value = null;
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
  let f = [...filters.value];
  if (e !== null) {
    let newFilters = e.filter(d => d.values.length > 0)
    f = [...filters.value, ...newFilters];
  }

  pendingFilters.value = true;
  const {data, pending, refresh, error} = await getActiveFilters({filters: f, lang: 'en', type: 'dress', fetchFilters: false});

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
@import  "/assets/style/global.scss";

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
