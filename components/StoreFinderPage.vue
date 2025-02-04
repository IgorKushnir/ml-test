<template>
  <div>
    <ContentBanner :data="banner" type="banner"/>
    <div v-if="countries">
      <InnerHeader v-if="countries[countryIndex]?.value" :title="countries[countryIndex]?.value"
                   :sub_header="$t('storefinder_title')"/>
      <InnerHeader v-else :title="$t('storefinder_title')"/>
      <StickyBarStickyHeaderMilla v-if="countryIndex === -1">
        <template #center>
          <div class="search-wrap">
            <div class="icon-wrap">
              <div class="icon-search-24"/>
            </div>
            <input type="text" :value="search" @input="handleInput" class="search" placeholder="Enter the the country"/>
          </div>
        </template>
      </StickyBarStickyHeaderMilla>
      <StickyBarStickyHeaderMilla v-if="countryIndex !== -1">

        <template #center>
          <Select v-if="!(countryCode === 'UA')" :data="countries" name="Country" all="All countries"
                  :index="countryIndex" :flag="true"
                  @index="(i) => changeCountry(i)"
                  searchable
                  />
          <Select v-if="states && states?.length > 0" :data="states" name="State" all="All states" :index="stateIndex"
                  @index="(i) => changeState(i)"/>
          <Select v-if="cities && cities?.length > 1" :data="cities" name="City" all="All cities" :index="cityIndex"
                  @index="(i) => changeCity(i)"
                  searchable
                  />
        </template>
        <template #end>
          <Select
              v-if="lines && lines?.length > 1" :data="lines" name="Lines" all="All lines" side="right"
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
                       :class="store.cover_1x1?.data ? 'col-8 col-12-xl' : (stores?.length <= 2) ? 'col-6 col-8-lg col-12-md' : 'col-4 col-6-xl col-12-md'"/>
          </template>
          <template v-if="countryIndex === -1" v-for="country in filteredCountries">
            <a :href="localePath('/store-finder/'+country.slug)" v-on:click="(e) => changeCountry(country.index, e)"
               class="col-4 col-6-xl col-12-md">
              <StoreItem :store="{country_code: country.flag, city: country.value}" country/>
            </a>
          </template>

        </Container>
      </transition>
      <Loading v-if="countryIndex !== -1 && pending" :pending="pending"/>
    </div>

    <Loading v-if="!countries" :pending="!countries"/>
    <PageNotFound :show="!data?.data && !pending && countryIndex !== -1"/>
    <Seo
        :data="data?.data?.attributes"
        :title="countries[countryIndex]?.value"
        :breadcrumbs="[
        {
          title: countryIndex !== -1 ? 'Wedding Dresses in ' + countries[countryIndex]?.value: 'Store finder',
        }
        ]"
        :localizations="[{locale: 'en', slug: 'store-finder'}, {locale: 'pl', slug: 'wyszukiwarka-sklepow'}]"
    />
  </div>
</template>

<script setup>
import {getListOfCountries, getCountry, getBanner} from '~/api/stores'
import getCountryCode from "../api/getCountryCode";
import { debounce } from './header/debounce';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n()
const localePath = useLocalePath()

// No transition for page
route.meta.pageTransition = {
  name: 'null'
}

const countrySlug = ref(route.params.country);
const countryCode = ref(null);
const countryIndex = ref(-1);
const stateIndex = ref(-1)
const cityIndex = ref(route.query.city || -1)
const lineIndex = ref(-1)
const showMap = ref(false)
const search = ref('')

const countries = ref(await getListOfCountries(locale.value).then(countries => countries.value.map((country, index) => ({...country, index})) ))
const banner = ref(await getBanner(locale.value))
const filteredCountries = ref(countries.value)

function filterCountries()  {
  filteredCountries.value = countries.value.filter(country => country.value.toLowerCase().includes(search.value.toLowerCase()))
  if (typeof window !== 'undefined') {
    nextTick(() => {
    setTimeout(() => {
      window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 200)
    })
  }
}

const debouncedFilterCountries = debounce(filterCountries)

const handleInput = ({target: {value}}) => {
search.value = value;
debouncedFilterCountries()
}

countryCode.value = await getCountryCode()

if (!countrySlug.value) {
  countryIndex.value = getIndexByCode(countryCode.value)
  countrySlug.value = getSlugByCode(countryCode.value)
} else {
  if (countryCode.value === 'UA') countrySlug.value = 'ukraine' // For Ukraine
  countryIndex.value = getIndexBySlug(countrySlug.value)
}

const {data, pending, refresh, error} = await useLazyAsyncData('country', () => getCountry(countrySlug.value, locale.value), {
  transform: (d) => {
    return d.data['storeFinder']
  }
})

const scrollToPrevCountry = () => {
const prevRouteName = router.options.history.state.forward
const isCountryRoute = prevRouteName.includes('store-finder')

if (prevRouteName && isCountryRoute && countries.value) {
  setTimeout(() => {
    const currentCountryNode = document.querySelector(`a[href="${prevRouteName}"]`);
    currentCountryNode && currentCountryNode.scrollIntoView()
  }, 1000)
}}

onMounted(async () => {
  if (countryCode.value) {
    changeRoute()
  }
  scrollToPrevCountry()
})

function getStores() {
  let stores = []
  data.value?.data?.attributes.city.forEach(city => {
    city.store?.forEach(store => {
      stores.push({...store,
        country_code: data.value.data.attributes.country_code,
        city: city.name,
        state: city.state
      })
    })
  })
  return stores
}

const stores = computed(() => {
  let sores = getStores();
  if (stateIndex.value !== -1) {
    sores = sores.filter(store => store.state === states.value[stateIndex.value]?.value)
  }
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

const states = computed(() => {
  if (countryIndex.value === -1) return [];
  const citiesWithStates = (data.value?.data?.attributes?.city ?? []).filter(city => city.state !== null && city.state !== '')
  
  if (citiesWithStates?.length === 0) {
    return []
  }
    const statesMap = new Map()
    citiesWithStates.forEach(({state}) => statesMap.set(state, state))
    return Array.from(statesMap.values()).sort((a, b) => a.localeCompare(b)).map(value => ({value}))
})
const cities = computed(() => {
  if (countryIndex.value === -1) return [];

  let _cities =  data.value?.data?.attributes?.city
      .filter(city => {
        return city.store?.length > 0
      })

  if (stateIndex.value !== -1) {
    _cities = _cities.filter(city => {
      return city.state === states.value[stateIndex.value].value
    })
  }

  return _cities?.map(({name}) => ({value: name})) ?? [];
})
const lines = computed(() => {
  if (countryIndex.value === -1) return [];

  let l = [];
  let keys = [];
  getStores()?.forEach(store => {
    if (cityIndex.value !== -1 && store.city !== cities.value[cityIndex.value]?.value) return

    if (store.lines.data?.length > 0) {
      store.lines.data?.forEach(line => {
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
  refresh()
})

async function getSlugByCode(code) {
  const index = countries.value?.findIndex(({flag}) => flag === code)
  return countries.value[index]?.slug
}

function getIndexBySlug(slug) {
  const index = countries.value.findIndex(c => c.slug === slug)
  return index
}

function getIndexByCode(code) {
  if (!countries.value) return -1
  const index = countries.value.findIndex(({flag}) => flag === code)
  return index
}


function changeCountry(index, e) {
  if (e) e.preventDefault()
  countryIndex.value = index
  countrySlug.value = countries.value[index]?.slug
  changeRoute()
  stateIndex.value = -1;
  cityIndex.value = -1;
  lineIndex.value = -1;
  if (index === -1) {
    showMap.value = false
  }
}

function changeState(index) {
  stateIndex.value = index;
  cityIndex.value = -1;
  lineIndex.value = -1;
}

function changeCity(index) {
  cityIndex.value = index;
  lineIndex.value = -1;
}

function changeLine(index) {
  lineIndex.value = index;
}

async function changeRoute() {
  const country = await countrySlug.value
  const path = country ? localePath(`/store-finder/${country}`) : localePath('/store-finder')

  navigateTo(path)
}


// Redirect from old path
if (route.query.country && is_server()) {
  navigateTo(localePath(`/store-finder/${route.query.country}`), {
    redirectCode: 301
  })
}

function is_server() {
  return !(typeof window != 'undefined' && window.document);
}
</script>

<style scoped lang="scss">
.search-wrap {
  width: 95vw;
  display: flex;
  align-items: center;
}

.icon-wrap {
  display: flex;
  width: 63px;
  min-width: 63px;
  height: 63px;
  justify-content: center;
  align-items: center;
  border-left: 1px solid $border-dark;
  border-right: 1px solid $border-dark;
}

.search {
  height: 63px;
  padding-left: 12px;
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  color: $dark-blue;

  :focus {
    border: none;
    outline: none;
  }

  :placeholder {
    color: #B4BABF;
  }
}

@include md {
  .icon-wrap {
    width: 54px;
    min-width: 54px;
    height: 54px;
    /* border-bottom: 1px solid $border-dark; */
  }

  .search {
    height: 54px;
    /* border-bottom: 1px solid $border-dark; */
  }
}

</style>
