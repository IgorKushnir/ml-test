<template>
  <div>
    <Seo title="Store finder" :breadcrumbs="[
        {
          title: 'Request an appointment',
        }
    ]"/>
    <InnerHeader title="Request an appointment" sub_title="To ensure an enchanting and unforgettable experience at Milla Nova, we kindly request that you furnish us with the necessary information. An expert adviser will contact you to confirm the details of your appointment."/>

    <pre>{{stores}}</pre>
    <transition mode="out-in" name="fade">
      <Container  v-if="!sent" justify="justify-center">
        <form class="col-6 col-8-xl col-10-lg col-12-md form" @submit.prevent="send">
          <div class="input-block c-4">
            <div class="subheader small m-b-8 m-t-32">Your contact details</div>
          </div>

          <div class="input-block c-2" :class="sendData['name'].error !== null ? 'error' : ''">
            <label class="p-small required" for="name">Name</label>
            <input
                autofocus
                class="input m-t-8"
                type="text"
                name="name"
                id="name"
                v-model="sendData['name'].value"
                placeholder="Enter your name"
            />
            <label for="name" class="error-message">{{ sendData['name'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['surname'].error !== null ? 'error' : ''">
            <label class="p-small required" for="surname">Surname</label>
            <input
                class="input m-t-8"
                type="text"
                name="surname"
                id="surname"
                v-model="sendData['surname'].value"
                placeholder="Enter your surname"
            />
            <label for="surname" class="error-message">{{ sendData['surname'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['email'].error ? 'error' : ''">
            <label class="p-small required" for="email">Email</label>
            <input
                class="input m-t-8"
                type="email"
                name="email"
                id="email"
                v-model="sendData['email'].value"
                placeholder="Enter your email"
            />
            <label for="surname" class="error-message">{{ sendData['email'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['phone'].error ? 'error' : ''">
            <label class="p-small required" for="phone">Telephone number</label>
            <input
                class="input m-t-8"
                type="tel"
                name="phone"
                id="phone"
                v-model="sendData['phone'].value"
                placeholder="Enter your telephone number"
            />
            <label for="surname" class="error-message">{{ sendData['phone'].error }}</label>
          </div>

          <div class="input-block c-4">
            <div class="subheader small m-b-8 m-t-32">Your preferred store</div>
          </div>

          <div class="input-block c-2" :class="sendData['country'].error ? 'error' : ''">
            <label class="p-small required" for="country">Country</label>
            <select
                class="input m-t-8"
                name="country"
                id="country"
                v-model="sendData['country'].value"
            >
              <option :value="undefined" :selected="sendData['country'].value === undefined">- Chose country -</option>
              <option v-for="country in countries" :value="country.slug" :selected="country.slug === sendData['country'].value">{{ country.value }}</option>
            </select>
            <label for="surname" class="error-message">{{ sendData['country'].error }}</label>
          </div>

          <div class="input-block c-2" :class="sendData['city'].error ? 'error' : ''">
            <label class="p-small required" for="city">City</label>
            <transition mode="out-in" name="fade">
              <div v-if="!pendingCountry">
                <select
                    class="input m-t-8"
                    name="city"
                    id="city"
                    v-model="sendData['city'].value"
                    :disabled="sendData['country'].value === undefined"
                >
                  <option :value="undefined" :selected="sendData['city'] === undefined"><strong>- Chose city -</strong></option>
                  <option v-for="city in cities" :value="city.name.toLowerCase()">{{ city.name }}</option>
                </select>
                <label for="surname" class="error-message">{{ sendData['city'].error }}</label>
              </div>
              <Spinner class="m-l-16 m-t-16 m-b-16" v-else />
            </transition>
          </div>

          <div class="input-block c-4" :class="sendData['store'].error ? 'error' : ''">
            <label class="p-small required" for="store">Store</label>
            <transition mode="out-in" name="fade">
              <div v-if="!pendingCountry">
                <select
                    class="input m-t-8"
                    name="store"
                    id="store"
                    v-model="sendData['store'].value"
                    :disabled="sendData['city'].value === undefined"
                >
                  <option :value="undefined" :selected="sendData['store'].value === undefined">- Chose store -</option>
                  <option
                      v-for="store in stores?.store"
                      :value="store.title.toLowerCase() + ' (' + store.address.toLowerCase() + ')'"
                  >{{ store.title + ' (' + store.address + ')' }}</option>
                </select>
                <label for="surname" class="error-message">{{ sendData['store'].error }}</label>
              </div>
              <Spinner class="m-l-16 m-t-16 m-b-16" v-else />
            </transition>
          </div>

          <div class="input-block c-4">
            <div class="subheader small m-b-8 m-t-32">Your timing</div>
          </div>

          <div class="input-block c-2" :class="sendData['celebrated_date'].error ? 'error' : ''">
            <label class="p-small required" for="celebrated_date">Celebrated date</label>
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
            <label class="p-small required" for="appointment_date">Appointment date</label>
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
                label="I would like to receive invitations to exclusive events and promotions, trends, brand news and surveys to express my opinion."
                available
            />
          </div>

          <input type="submit" title="Send" style="display: none"/>

          <div class="c-4 m-v-24 center">
            <div class="button primary" :class="loading ? 'loading' : ''" v-on:click="send">
              <transition name="fade" mode="out-in">
                <span v-if="!loading">Send</span>
                <Spinner v-else white/>
              </transition>
            </div>
          </div>

        </form>
      </Container>
      <State v-else title="Thank you!" text="We have received your details and request. We will get in touch soon to confirm the time and date of your appointment." :button="{text: 'Home page', path: '/'}" />
    </transition>
  </div>
</template>

<script setup>
//XBJeQV
// pk_92dafbb1e050d23161f8634794882d402c
import CheckBox from "../components/filter/CheckBox";

import {getListOfCountries} from '~/api/stores'
import getCountryCode from '~/api/getCountryCode'
import {getCountry} from "~/api/stores";
import Loading from "../components/Loading";

const config = useRuntimeConfig();
const apiUrl = config.STRAPI_URL;

const router = useRouter();
const route = useRoute();


const countryCode = await getCountryCode();
const countries = ref(await getListOfCountries('en'));
let countrySlug;
if (countries.value) {
  countrySlug = getSlugByCode(countryCode);
} else {
  watch(() => countries.value, () => {
    sendData.value.country.value = getSlugByCode(countryCode);
    setTimeout(refreshCountry, 100)
  })
}

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
    error: null
  },


  country: {
    value: route.query.country ?? countrySlug ,
    required: true,
    error: null
  },
  city: {
    value: route.query.city,
    required: true,
    error: null
  },
  store: {
    value: route.query.store,
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
})


const loading = ref(false)
const sent = ref(false)


const cities = computed(() => {
  sendData.value.city.value = undefined
  let cities = countryData?.value?.data?.attributes?.city

  // Exclude the stores with only 'milla-evening' line slug
  cities = cities.filter(c => {
    c.store = c.store.filter(s => {
      return  s.lines.data.length !== 0 && !(s.lines.data.length <= 1 && s.lines.data.map(l => l.attributes.slug).includes('milla-evening'))
    })
    return c.store.length > 0
  })
  return cities
})
const stores = computed(() => {
  sendData.value.store.value = undefined
  const index = cities?.value?.findIndex((c) => c.name.toLowerCase() === sendData.value.city.value);
  if (index !== null && index !== -1) {
    const s = cities?.value[index]
    if (s.length === 1) {
      sendData.value.store.value = c.name.toLowerCase() +  + ' (' + c.address.toLowerCase() + ')'
    }
    return s
  }
  return undefined
})



const {data: countryData, pending: pendingCountry, refresh: refreshCountry, error: errorCountry} = await useLazyAsyncData('country', () => getCountry(sendData.value.country.value,'en'), {
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



function send() {
  // sent.value = true
  const keys = Object.keys(sendData.value);
  // console.log(keys);
  let firstError;
  keys.forEach((key) => {
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


    // $fetch(apiUrl + '/email-provider/send',
    //     {
    //       method: 'post',
    //       body: {
    //         "data": sendData.value
    //       }
    //     }
    // ).then(res => {
    //   // console.log(res);
    //   sent.value = true;
    // }).catch(error => console.log('error', error))
  }
}

function checkField(key) {
  const item = sendData.value[key];
  if (item.required) {
    if (!item.value || item.value.length === 0) {
      item.error = 'The field must not be empty';
      return false
    }
    if (key === 'email' && !validateEmail(item.value)) {
      item.error = 'Email is not valid';
      return false
    }

  }
  item.error = null;
  return true
}
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function getSlugByCode(code) {
  const index = countries.value.findIndex(c => c.flag === code)
  return countries.value[index]?.slug
}
</script>

<style scoped>


</style>
