<template>
  <div>
    <Seo title="Book an appointment" :breadcrumbs="[
        {
          title: $t('book_title'),
        }
    ]"
         :localizations="[{locale: 'en', slug: 'request-an-appointment'}, {locale: 'pl', slug: 'request-an-appointment'}]"
    />

    <InnerHeader :title="$t('book_title')" :sub_title="!sent ? $t('book_sub_title') : ''"/>

    <div v-if="queryData.store">
      <div class="row justify-center">
        <div class="col-12 light-blue">
          <div class="center m-v-24 m-v-16-md p-h-16">
            <div>{{queryData.store}}, {{capitalizeFirstLetter(queryData.city)}}, {{capitalizeFirstLetter(queryData.country_slug)}}</div>
          </div>
        </div>
      </div>
    </div>

    <transition mode="out-in" name="fade">
      <Container  v-if="!sent" justify="justify-center">
        <form class="col-6 col-8-xl col-10-lg col-12-md form" @submit.prevent="send">
          <div class="input-block c-4">
            <div class="subheader small m-b-8 m-t-32">{{ $t('book_your_contact_information') }}</div>
          </div>

          <div class="input-block c-2" :class="sendData['name'].error !== null ? 'error' : ''">
            <label class="p-small required" for="name">{{ $t('book_first_name') }}</label>
            <input
                autofocus
                class="input m-t-8"
                type="text"
                name="name"
                id="name"
                v-model="sendData['name'].value"
                :placeholder="$t('book_enter_your_first_name')"
            />
            <label for="name" class="error-message">{{ sendData['name'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['surname'].error !== null ? 'error' : ''">
            <label class="p-small required" for="surname">{{ $t('book_last_name') }}</label>
            <input
                class="input m-t-8"
                type="text"
                name="surname"
                id="surname"
                v-model="sendData['surname'].value"
                :placeholder="$t('book_enter_your_last_name')"
            />
            <label for="surname" class="error-message">{{ sendData['surname'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['email'].error ? 'error' : ''">
            <label class="p-small required" for="email">{{ $t('book_email') }}</label>
            <input
                class="input m-t-8"
                type="email"
                name="email"
                id="email"
                v-model="sendData['email'].value"
                :placeholder="$t('book_enter_your_email')"
            />
            <label for="surname" class="error-message">{{ sendData['email'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['phone'].error ? 'error' : ''">
            <label class="p-small required" for="phone">{{ $t('book_phone_number') }}</label>
            <input
                class="input m-t-8"
                type="tel"
                name="phone"
                id="phone"
                v-model="sendData['phone'].value"
                :placeholder="$t('book_enter_your_phone_number')"
            />
            <label for="surname" class="error-message">{{ sendData['phone'].error }}</label>
          </div>

          <template v-if="!queryData.available">
            <div class="input-block c-4">
              <div class="subheader small m-b-8 m-t-32">{{ $t('book_your_preferred_store') }}</div>
            </div>

            <div class="input-block c-2" :class="sendData['country'].error ? 'error' : ''">
              <label class="p-small required" for="country">{{ $t('book_country') }}</label>
              <select
                  class="input m-t-8"
                  name="country"
                  id="country"
                  v-model="sendData['country'].value"
              >
                <option :value="undefined" :selected="sendData['country'].value === undefined">- {{ $t('book_choose_country') }} -</option>
                <option v-for="country in countries" :value="country.slug" :selected="country.slug === sendData['country'].value">{{ country.value }}</option>
              </select>
              <label for="surname" class="error-message">{{ sendData['country'].error }}</label>
            </div>

            <div class="input-block c-2" :class="sendData['city'].error ? 'error' : ''">
              <label class="p-small required" for="city">{{ $t('book_city') }}</label>
              <transition mode="out-in" name="fade">
                <div v-if="!pendingCountry">
                  <select
                      class="input m-t-8"
                      name="city"
                      id="city"
                      v-model="sendData['city'].value"
                      :disabled="sendData['country'].value === undefined"
                  >
                    <option :value="undefined" :selected="sendData['city'] === undefined"><strong>- {{ $t('book_choose_city') }} -</strong></option>
                    <option v-for="city in cities" :value="city.name.toLowerCase()">{{ city.name }}</option>
                  </select>
                  <label for="surname" class="error-message">{{ sendData['city'].error }}</label>
                </div>
                <Spinner class="m-l-16 m-t-16 m-b-16" v-else />
              </transition>
            </div>

            <div class="input-block c-4" :class="sendData['store'].error ? 'error' : ''">
              <label class="p-small required" for="store">{{ $t('book_store') }}</label>
              <transition mode="out-in" name="fade">
                <div v-if="!pendingCountry">
                  <select
                      class="input m-t-8"
                      name="store"
                      id="store"
                      v-model="sendData['store'].index"
                      :disabled="sendData['city'].value === undefined"
                  >
                    <option :value="-1" :selected="sendData['store'].value === -1">- {{ $t('book_choose_store') }} -</option>
                    <option
                        v-for="(store, index) in stores?.store"
                        :value="index"
                    >{{ store.title + ' (' + store.address + ')'}}</option>
                  </select>
                  <label for="surname" class="error-message">{{ sendData['store'].error }}</label>
                </div>
                <Spinner class="m-l-16 m-t-16 m-b-16" v-else />
              </transition>
            </div>
          </template>

          <div class="input-block c-4">
            <div class="subheader small m-b-8 m-t-32">{{ $t('book_your_timing') }}</div>
          </div>

          <div class="input-block c-2" :class="sendData['celebrated_date'].error ? 'error' : ''">
            <label class="p-small required" for="celebrated_date">{{ $t('book_celebrated_date') }}</label>
            <input
                class="input m-t-8"
                type="date"
                name="celebrated_date"
                id="celebrated_date"
                v-model="sendData['celebrated_date'].value"
            />
            <label for="surname" class="error-message">{{ sendData['celebrated_date'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['appointment_date'].error ? 'error' : ''">
            <label class="p-small required" for="appointment_date">{{ $t('book_preferable_appointment_date') }}</label>
            <input
                class="input m-t-8"
                type="date"
                name="appointment_date"
                id="appointment_date"
                v-model="sendData['appointment_date'].value"
            />
            <label for="surname" class="error-message">{{ sendData['appointment_date'].error }}</label>
          </div>

          <div class="input-block c-4">
            <CheckBox
                :value="sendData['subscribe'].value"
                v-on:click="sendData['subscribe'].value = !sendData['subscribe'].value"
                :label="$t('book_confirm')"
                available
            />
          </div>

          <input type="submit" title="Send" style="display: none"/>

          <div class="c-4 m-v-24 center">
            <div class="button primary" :class="loading ? 'loading' : ''" v-on:click="send">
              <transition name="fade" mode="out-in">
                <span v-if="!loading">{{ $t('book_send') }}</span>
                <Spinner v-else white/>
              </transition>
            </div>
          </div>

        </form>
      </Container>
      <State v-else small :title="$t('book_thank_you')" :text="$t('book_has_been_processed')" :button="{text: $t('book_home_page'), path: '/'}" />
    </transition>
  </div>
</template>

<script setup>
import CheckBox from "../../components/filter/CheckBox";
import phoneCodes from '~/api/phoneCodes.json'

import {getListOfCountries, getCountry} from '~/api/stores'
import getCountryCode from '~/api/getCountryCode'

const config = useRuntimeConfig();
const apiUrl = config.public.strapi.url;
const { locale, t } = useI18n()

const route = useRoute();

const queryData = ref({
  available: false,
  country_slug: null,
  city: null,
  store: null,
  store_email: null,
});

const source = ref('Direct')
if (route.query.source) {
  source.value = route.query.source;
}
if (route.query.q) {
  try {
    let qString = decodeFromBase64(route.query.q);
    let qData = JSON.parse(qString);
    queryData.value = {
      available: true,
      country_slug: qData[0],
      city: qData[1],
      store: qData[2],
      store_email: qData[3],
    }
  } catch (e) {
  }
}
function decodeFromBase64(string) {
  if (process.client) {
    return atob(string);
  } else {
    return Buffer.from(string, 'base64').toString('utf-8');
  }
}

// Todo: do it on client side or refresh
let countryCode = "US";
const countries = ref(await getListOfCountries(locale.value));

let countrySlug = getSlugByCode(countryCode);


onMounted(async () => {
  // this code will only be executed on the client-side
  countryCode = await getCountryCode(); //
  countrySlug = getSlugByCode(countryCode);
  if (!queryData.value.available) {
    sendData.value.country.value = getSlugByCode(countryCode);
    refreshCountry()
  }
  setCountryCode()
})

const sendData = ref({
  name: {
    value: '',
    required: true,
    error: null
  },
  surname: {
    value: '',
    required: true,
    error: null
  },
  email: {
    value: '',
    required: true,
    error: null
  },
  phone: {
    value: '',
    required: true,
    error: null,
  },
  country: {
    value: queryData.value.country_slug ?? countrySlug ,
    required: true,
    error: null
  },
  city: {
    value: queryData.value.city,
    required: true,
    error: null
  },
  store: {
    value: queryData.value.store,
    required: true,
    error: null
  },
  celebrated_date: {
    value: '',
    required: true,
    error: null
  },
  appointment_date: {
    value: '',
    required: true,
    error: null
  },
  subscribe: {
    value: false,
    required: false,
    error: null
  },
  store_email: {
    value: queryData.value.store_email
  }
})

const loading = ref(false)
const sent = ref(false)

function setCountryCode() {
  const index = phoneCodes.findIndex(l => l.code === countryCode)
  if (index && index !== -1) {
    sendData.value.phone.value = phoneCodes[index].dial_code
  }
}
setCountryCode();


const cities = computed(() => {
  let cities = countryData?.value?.data?.attributes?.city
  if (!cities) return  []

  // Exclude the stores with only 'milla-evening' line slug
  // Exclude the stores without store email
  cities = cities.filter(c => {
    c.store = c.store.filter(s => {
      return  s.lines?.data?.length !== 0 && !(s.lines?.data?.length <= 1 && s.lines?.data.map(l => l.attributes.slug).includes('milla-evening')) && (s.email !== null && s.email !== '')
    })
    return c.store?.length > 0
  })
  return cities
})

const stores = ref()
function getStores() {
  sendData.value.store.index = -1
  sendData.value.store.value = ''
  const index = cities?.value?.findIndex((c) => c.name.toLowerCase() === sendData.value.city.value);
  if (index !== null && index !== -1) {
    const s = cities?.value[index]
    stores.value = s
  } else {
    stores.value = undefined
  }
}

const {data: countryData, pending: pendingCountry, refresh: refreshCountry} = await useLazyAsyncData('country', () => getCountry(sendData.value.country.value, locale.value), {
  transform: (d) => {
    return d.data['storeFinder']
  }
})

watch(() => sendData.value.country.value, () => {
  sendData.value.city.value = undefined
  if (sendData.value.country.value === undefined) {
    return
  }
  refreshCountry()
})

watch(() => sendData.value.city.value, () => {
  getStores()
})

watch(() => sendData.value.store.index, (store) => {
  const index = sendData.value.store.index;
  if (index === -1) {
    sendData.value.store.value = ''
    sendData.value.store_email.value = null
  } else {
    sendData.value.store.value = (stores.value.store[index]?.title ?? '') + ' (' + (stores.value.store[index]?.address ?? '')  + ')'
    sendData.value.store_email.value = stores.value.store[index]?.email ?? null;
  }
})

watch(() => sendData.value.phone.value, (phone) => {
  if (phone?.length === 0) {
    phone = '+'
  }
  if (phone[0] !== '+') {
    phone = `+${phone.slice(1)}`
  }

  phone = phone.replace(/[^+0-9]/g, "")
  sendData.value.phone.value = phone
})


function send() {
  const keys = Object.keys(sendData.value);
  let firstError;
  keys?.forEach((key) => {
    let isError = checkField(key)
    if (!isError && !firstError) {
      firstError = key;
    }
  })

  // Scroll to first error
  if (firstError) {
    const yOffset = -40;
    const element = document.getElementById(firstError);
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

  if (!firstError) {
    loading.value = true

    let finalData = {};
    keys?.forEach((key) => {
      finalData[key] = sendData.value[key].value ?? null
    })

    if (source.value) {
      finalData = {
        ...finalData,
        source: source.value
      }
    }

    $fetch(apiUrl + '/email-provider/sendAppointment',
        {
          method: 'post',
          body: finalData
        }
    ).then(res => {
      sent.value = true;
      fbq('track', 'Lead'); // Pixel??
      // gtag('event', 'success_form_send_request', {
      //   'send_to': `${process.env.GTAG_KEY}/E3k4COnnw5cZELm1yqY9`,
      //   // peopleJoinWithMe: userData.value.people,
      //   // howDidIFindOut: userData.value.find_out ?? 'null'
      // });
    }).catch(error => console.log('error', error))
  }
}

function checkField(key) {
  const item = sendData.value[key];
  if (item.required) {
    if (!item.value || item.value?.length === 0) {
      item.error = t('book_error_empty_field');
      return false
    }
    if (key === 'email' && !validateEmail(item.value)) {
      item.error = t('book_error_email');
      return false
    }
    if (key === 'phone') {
      if (!validatePhone(item.value)) {
        item.error = t('book_error_phone');
        return false
      }
    }
  }
  item.error = null;
  return true
}
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function validatePhone(phone) {
  const regex = /^\+?([0-9]{10,14})$/;
  const phoneCodesList = phoneCodes.map(p => p.dial_code);
  let codeError = true;
  for (let i = 0; i < phoneCodesList?.length; i++) {
    if (phone.startsWith(phoneCodesList[i])) {
      codeError = false;
      break;
    }
  }
  return regex.test(phone) && !codeError;
}

function getSlugByCode(code) {
  const index = countries.value.findIndex(c => c.flag === code)
  return countries.value[index]?.slug
}

function capitalizeFirstLetter(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped>


</style>
