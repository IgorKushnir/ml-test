<template>
  <div>
    <Seo title="Store finder"/>

    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader title="Store finder"/>
        <StickyHeader>

          <template #center>
            <Select :data="getCountries()" name="Country" all="All countries" :index="dataIndex" :flag="true"
                    @index="changeCountry"/>
            <Select v-if="getCities().length > 1" :data="getCities()" name="City" all="All cities" :index="cityIndex"
                    @index="changeCity"/>
          </template>
          <template #end>
            <Select
                v-if="lines.length > 1" :data="lines" name="Lines" all="All lines" side="right" :index="lineIndex"
                @index="changeLine"
            />
          </template>


        </StickyHeader>

        <!-- Toggle-->
        <TagContainer class="hide-md">
          <span class="p-small" style="margin: -3px 16px 0"><strong>Show on map</strong></span>
          <Toggle @show="e => showMapHandler(e)"/>
        </TagContainer>


        <Container v-if="!showMap" justify="justify-center">
          <template v-for="store in stores">
            <StoreItem :store="store"
                       :class="stores.length <= 2 ? 'col-6 col-8-lg col-12-md' : 'col-4 col-6-xl col-12-md'"/>
          </template>
        </Container>


        <Container v-if="showMap">
          <div class="col-12">
            <Map :data="stores" :show="showMap"/>
          </div>

        </Container>


      </div>
    </transition>

    <Loading :pending="pending"/>

  </div>
</template>


<script setup>
import getCountryCode from '~/api/getCountryCode'
import getStores from '~/api/getStores'
import Map from "../components/store/Map";
import TagContainer from "../components/TagContainer";

const router = useRouter();
const route = useRoute();
let country = route.query.country;
let dataIndex = ref(-1);
let cityIndex = ref(-1);
let lineIndex = ref(-1);

let stores = ref([])
let lines = ref([])

let countryCode = ref(null);
let showMap = ref(false)
const map = ref()

const {data, pending, refresh, error} = await getStores('en')
if (country == null) {
  countryCode.value = await getCountryCode();
}
if (data.value != null) {
  changeRoute()
  stores.value = getStoresByIndex(dataIndex.value);
  getLines()

} else {
  watch(() => data.value, () => {
    changeRoute()
    stores.value = getStoresByIndex(dataIndex.value);
    getLines()
  })
}


watch(() => dataIndex.value, () => {
  stores.value = getStoresByIndex(dataIndex.value)
  getLines()
})
watch(() => cityIndex.value, () => {

  stores.value = getStoresByIndex(dataIndex.value)
  getLines()
})
watch(() => lineIndex.value, () => {
  stores.value = getStoresByIndex(dataIndex.value)
})


function getIndexOfDataByCode(code) {
  return data.value.findIndex(d => d.attributes.country_code === code)
}

function getIndexOfDataBySlug(code) {
  return data.value.findIndex(d => d.attributes.slug === code)
}


// Change routing query
function changeRoute() {
  if (countryCode.value == null) {
    dataIndex.value = getIndexOfDataBySlug(country);
    router.replace({
      query: {country: country},
    })
  } else {
    console.log(countryCode.value);
    dataIndex.value = getIndexOfDataByCode(countryCode.value);
    router.replace({
      query: {country: data.value[dataIndex.value]?.attributes?.slug ?? 'all'},
    })
  }

}

function getStoresByIndex(index) {
  let _stores = []
  if (index !== -1) {
    // Return stores in specific city
    if (cityIndex.value !== -1) {
      let city = data.value[index].attributes.city[cityIndex.value];
      city.store.forEach(store => {
        _stores.push(store)
      })
    } else {
      // Return stores by index
      let d = data.value[index].attributes.city;

      d.forEach(city => {
        city.store.forEach(store => {
          _stores.push(store)
        })
      })
    }

  } else {
    // Return all stores
    data.value.forEach(e => {
      e.attributes.city.forEach(city => {
        city.store.forEach(store => {
          _stores.push(store)
        })
      })
    })
  }
  if (lineIndex.value !== -1) {
    const lineSlug = lines.value[lineIndex.value].key
    _stores = _stores.filter(store => {
      if (store.lines.data.length > 0) {
        const lineSlugs = store.lines.data.map(line => line.attributes.slug);
        if (lineSlugs.includes(lineSlug)) {
          return true
        }
      }

    })
  }
  return _stores;

}

function getCountries() {
  return data.value.map(e => {
    return {value: e.attributes.country, flag: e.attributes.country_code}
  })
}

function getCities() {
  if (dataIndex.value !== -1) {
    return data.value[dataIndex.value].attributes.city.map(c => {
      return {value: c.name}
    });
  }
  return [];
}

function getLines() {
  let l = [];
  let keys = [];
  stores.value.forEach(store => {
    if (store.lines.data.length > 0) {
      store.lines.data.forEach(line => {
        const slug = line.attributes.slug;
        if (!keys.includes(slug)) {
          l.push({
            key: line.attributes.slug,
            value: line.attributes.title,
          })
          keys.push(slug)
        }
      })
    }
  })

  lines.value = l;

}

function showMapHandler(e) {
  showMap.value = e
}

function changeCountry(e) {
  cityIndex.value = -1;
  lineIndex.value = -1;
  dataIndex.value = e;
  if (dataIndex.value !== -1) {
    router.replace({
      query: {country: data.value[dataIndex.value].attributes.slug},
    })
  } else {
    router.replace({
      query: {country: 'all'},
    })
  }
}

function changeCity(e) {
  cityIndex.value = e;
  lineIndex.value = -1;
}

function changeLine(i) {
  lineIndex.value = i;

}


</script>


<style scoped lang="scss">


</style>
