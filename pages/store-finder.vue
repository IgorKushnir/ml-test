<template>
  <div>
    <div v-if="!pending && data != null">
      <InnerHeader title="Store finder"/>
      <StickyHeader>
        <div class="container">
          <div class="row justify-center">
            <Select :data="getCountries()" name="All countries" :index="dataIndex" :flag="true" @index="changeCountry"/>
            <Select v-if="getCities().length > 1" :data="getCities()" name="All cities" :index="cityIndex" @index="changeCity"/>
          </div>

        </div>
      </StickyHeader>

      <!-- Toggle-->
      <div v-if="!isMobile" class="container">
        <div class="row">
          <div class="toggle-container">
            <span class="label">Show on map</span>
            <Toggle @show="e => showMapHandler(e)"/>
          </div>
        </div>

      </div>

      <div class="container">
        <StoreMap v-if="!isMobile" ref="map" :data="getStoresByIndex(dataIndex)" :show="showMap"/>


        <div class="m-v-80" v-if="!showMap">
          <div class="row gap-S justify-center">
            <template v-for="item in getStoresByIndex(dataIndex)">
              <StoreItem :data="item" :classes="getStoresByIndex(dataIndex).length === 1 ? 'col-5 col-6-xl col-8-lg col-12-md' : 'col-4 col-6-xl col-12-md' "/>
            </template>
          </div>
        </div>
      </div>

    </div>
    <Loading v-if="pending"/>
    <PageNotFound v-if="data === null"/>
  </div>
</template>


<script setup>
import getCountryCode from '~/api/getCountryCode'
import getStores from '~/api/getStores'

const router = useRouter();
const route = useRoute();
let country = route.query.country;
let dataIndex = ref(-1);
let cityIndex = ref(-1);

let countryCode = ref(null);
let showMap = ref(false)
const map = ref()
const isMobile = useIsMobile();


function getIndexOfDataByCode(code) {
  return data.value.findIndex(d => d.attributes.country_code === code)
}

function getIndexOfDataBySlug(code) {
  return data.value.findIndex(d => d.attributes.slug === code)
}


if (country == null) {
  countryCode.value = await getCountryCode();
}

const {data, pending, refresh, error} = await getStores('en')

if (countryCode.value == null) {
  dataIndex.value = getIndexOfDataBySlug(country);
  router.replace({
    query: {country: country},
  })
} else {
  dataIndex.value = getIndexOfDataByCode(countryCode.value);
  router.replace({
    query: {country: data.value[dataIndex.value].attributes.slug},
  })
}

function getStoresByIndex(index) {
  if (index !== -1) {
    // Return stores in specific city
    if (cityIndex.value !== -1) {
      let d = data.value[index].attributes.city[cityIndex.value];
      d.country_code = data.value[index].attributes.country_code;
      return [d];
    }
    // Return stores by index
    let d = data.value[index].attributes.city;
    d.forEach(e => {
      e.country_code = data.value[index].attributes.country_code;
    })
    return d
  } else {
    // Return all stores
    let allStores = [];
    data.value.forEach(e => {
      e.attributes.city.forEach(c => {
        let d = c;
        d.country_code = e.attributes.country_code
        allStores.push(c)
      })
    })
    return allStores;
  }
}

function getCountries() {
  return data.value.map(e => { return {value: e.attributes.country, flag: e.attributes.country_code} })
}

function getCities() {
  if (dataIndex.value !== -1) {
    return data.value[dataIndex.value].attributes.city.map(c => {return { value: c.name }});
  }
  return [];
}

function showMapHandler(e) {
  showMap.value = e
}

function changeCountry(e) {
  cityIndex.value = -1;
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
}


</script>


<style scoped lang="scss">
.toggle-container {
  position: absolute;
  top: 23px;
  right: 0;
  display: flex;
  .label {
    margin-right: 16px;
    margin-top: 3px;
  }
}


</style>
