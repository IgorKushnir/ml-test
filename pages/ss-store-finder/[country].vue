<template>
  <div>
    <!--    Create route store-->
<!--    {{route.params}}-->
    <Seo title="Store finder" :breadcrumbs="[
        {
          title: 'Store finder',
        }
    ]"
    />

    <div v-if="countries">
      <InnerHeader v-if="countries[countryIndex]?.value" :title="countries[countryIndex]?.value" sub_header="Store finder"/>
      <InnerHeader v-else title="Store finder"/>
      <StickyBarStickyHeaderMilla>

        <template #center>
          <Select v-if="!(countryCode === 'UA')" :data="countries" name="Country" all="All countries" :index="countryIndex" :flag="true"
                  @index="(i) => changeCountry(i)"/>
          <Select v-if="cities && cities.length > 1" :data="cities" name="City" all="All cities" :index="cityIndex"
                  @index="(i) => changeCity(i)"/>
        </template>
        <template #end>
          <Select
              v-if="lines && lines.length > 1" :data="lines" name="Lines" all="All lines" side="right"
              :index="lineIndex"
              @index="(i) => changeLine(i)"
          />
        </template>


      </StickyBarStickyHeaderMilla>

      <!-- Toggle-->
      <transition name="fade">
        <TagContainer v-if="countryIndex !== -1" class="hide-md">
          <span class="p-small" style="margin: -3px 16px 0"><strong>Show on map</strong></span>
          <Toggle @show="e => showMap = e"/>
        </TagContainer>
      </transition>

      <Container v-if="showMap">
        <div class="col-12">
          <StoreMap :data="stores" :show="showMap"/>
        </div>
      </Container>


      <transition name="fade">
        <Container v-if="!showMap && !pending">
          <template v-if="countryIndex !== -1" v-for="store in stores">
            <StoreItem :store="store"
                       :class="stores.length <= 2 ? 'col-6 col-8-lg col-12-md' : 'col-4 col-6-xl col-12-md'"/>
          </template>
          <template v-if="countryIndex === -1" v-for="(country, index) in countries">
            <NuxtLink :to="'/store-finder/'+country.slug" v-on:click="changeCountry(index)"
                      :class="'col-4 col-6-xl col-12-md'">
              <StoreItem :store="{country_code: country.flag, city: country.value}" country/>
            </NuxtLink>
          </template>

        </Container>
      </transition>
      <Loading v-if="countryIndex !== -1 && pending" :pending="pending"/>


    </div>


    <Loading v-if="!countries" :pending="!countries"/>

    <PageNotFound :show="!data?.data && !pending && countryIndex !== -1"/>
  </div>
</template>

<script setup>
import {getListOfCountries} from '~/api/stores'
import getCountryCode from '~/api/getCountryCode'
import {getCountry} from "../../api/stores";

const router = useRouter();
const route = useRoute();

const countrySlug = ref(route.params.country);
const countryCode = ref(null);
const countryIndex = ref(-1);

const cityIndex = ref(-1)
const lineIndex = ref(-1)

let showMap = ref(false)

const countries = ref(await getListOfCountries('en'))



// if (process.client) {
//   const country = document.cookie.replace(
//       /(?:(?:^|.*;\s*)country\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1",
//   );
//   countryCode.value = country;
//   console.log('client', country);
// }
// if (process.server) {
//   const nuxtApp = useNuxtApp()
//   const { ssrContext } = nuxtApp
//   const event = ssrContext.event
//   const country = event.context.country
//   countryCode.value = country
//   // console.log('server', country);
// }
//
//
//
// // console.log('b - ', countrySlug.value);
// if (!countrySlug.value) {
//   countryIndex.value = getIndexByCode(countryCode.value)
//   countrySlug.value = getSlugByCode(countryCode.value)
// } else {
//   if (countryCode.value === 'UA') countrySlug.value = 'ukraine' // For Ukraine
//   countryIndex.value = getIndexBySlug(countrySlug.value)
// }
//
// const {data, pending, refresh, error} = await useLazyAsyncData('country', () => getCountry(countrySlug.value, 'en'), {
//   transform: (d) => {
//     return d.data['storeFinder']
//   }
// })
//
//
// onMounted(async () => {
//   if (countryCode.value) {
//     changeRoute()
//   }
// })



function getStores() {
  let stores = []
  data.value?.data?.attributes.city.forEach(city => {
    city.store.forEach(store => {
      store.country_code = data.value.data.attributes.country_code
      store.city = city.name
      stores.push(store)
    })
  })
  return stores
}

const stores = computed(() => {
  // return []
  let sores = getStores();
  if (cityIndex.value !== -1) {
    sores = sores.filter(store => store.city === cities.value[cityIndex.value]?.value)
  }
  if (lineIndex.value !== -1) {
    sores = sores.filter(store => {
      return lines.value[lineIndex.value]?.value ? store.lines.data.map(line => line.attributes.title).includes(lines.value[lineIndex.value]?.value) : true;
    })
  }
  // Sorting premium first
  return [...sores.filter(store => store.premium), ...sores.filter(store => !store.premium)];
  // return sores;
})
const cities = computed(() => {
  // return []
  if (countryIndex.value === -1) return [];

  return data.value?.data?.attributes?.city
      .filter(city => {
        return city.store.length > 0
      })
      .map(c => {
        return {value: c.name}
      });
})
const lines = computed(() => {
  // return []
  if (countryIndex.value === -1) return [];

  let l = [];
  let keys = [];
  getStores().forEach(store => {
    if (cityIndex.value !== -1 && store.city !== cities.value[cityIndex.value]?.value) return

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

  return l;
})

watch(() => countrySlug.value, (s) => {
  // console.log('---', countrySlug.value);
  refresh()
})

// onMounted(async () => {
//   if (countrySlug.value !== data?.value?.data?.attributes?.slug) {
//     // console.log('here', countrySlug.value);
//     refresh()
//   }
// })


// async function getCountryNameByIndex(index) {
//   if (index !== -1) return countries.value[index]
// }

async function getSlugByCode(code) {
  const index = countries.value?.findIndex(c => c.flag === code)
  return countries.value[index]?.slug
}

function getIndexBySlug(slug) {
  const index = countries.value.findIndex(c => c.slug === slug)
  return index
}
function getIndexByCode(code) {
  if (!countries.value) return -1
  const index = countries.value.findIndex(c => c.flag === code)
  return index
}


function changeCountry(index) {
  countryIndex.value = index
  countrySlug.value = countries.value[index]?.slug
  changeRoute()
  cityIndex.value = -1;
  lineIndex.value = -1;
  if (index === -1) {
    showMap.value = false
  }
}

function changeCity(index) {
  cityIndex.value = index;
  lineIndex.value = -1;
}

function changeLine(index) {
  lineIndex.value = index;
}

async function changeRoute() {
  // history.pushState(
  //     {},
  //     null,
  //     await countrySlug.value
  // )
  router.replace({
    params: {country: await countrySlug.value},
  })
}


</script>

<style scoped>

</style>
