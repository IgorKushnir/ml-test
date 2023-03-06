<template>
  <div>
    <Seo title="Store finder" :breadcrumbs="[
        {
          title: 'Request an appointment',
        }
    ]"/>
    <InnerHeader title="Request an appointment" sub_title="To ensure an enchanting and unforgettable experience at Milla Nova, we kindly request that you furnish us with the necessary information. An expert adviser will contact you to confirm the details of your appointment."/>

<!--    <pre>{{sendData}}</pre>-->
    <Container justify="justify-center">
      <form class="col-6 col-8-xl col-10-lg col-12-mg form" @submit.prevent="send">
        <div class="input-block c-4">
          <div class="subheader small m-b-8 m-t-32">Your contact details</div>
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="name">Name</label>
          <input
              autofocus
              class="input m-t-8"
              type="text"
              name="name"
              id="name"
              v-model="sendData['name']"
              required
          />
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="surname">Surname</label>
          <input
              class="input m-t-8"
              type="text"
              name="surname"
              id="surname"
              v-model="sendData['surname']"
          />
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="email">Email</label>
          <input
              class="input m-t-8"
              type="email"
              name="email"
              id="email"
              v-model="sendData['email']"
          />
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="phone">Telephone number</label>
          <input
              class="input m-t-8"
              type="tel"
              name="phone"
              id="phone"
              v-model="sendData['phone']"
          />
        </div>

        <div class="input-block c-4">
          <div class="subheader small m-b-8 m-t-32">Your preferred store</div>
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="country">Country</label>
          <select
              class="input m-t-8"
              name="country"
              id="country"
              v-model="sendData['country']"
          >
            <option :value="undefined" :selected="sendData['country'] === undefined">--- Chose country ---</option>
            <option v-for="country in countries" :value="country.slug" :selected="country.slug === sendData['country']">{{ country.value }}</option>
          </select>
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="city">City</label>
          <select
              class="input m-t-8"
              name="city"
              id="city"
              v-model="sendData['city']"
          >
            <option :value="undefined" :selected="sendData['city'] === undefined">--- Chose city ---</option>
            <option v-for="city in cities" :value="city.name.toLowerCase()">{{ city.name }}</option>
          </select>
        </div>

        <div class="input-block c-4">
          <label class="p-small required" for="store">Store</label>
          <select
              class="input m-t-8"
              name="store"
              id="store"
              v-model="sendData['store']"
          >
            <option :value="undefined" :selected="sendData['store'] === undefined">--- Chose store ---</option>
            <option
                v-for="store in stores?.store"
                :value="store.title.toLowerCase() + ' (' + store.address.toLowerCase() + ')'"
            >{{ store.title + ' (' + store.address + ')' }}</option>
          </select>
        </div>

        <div class="input-block c-4">
          <div class="subheader small m-b-8 m-t-32">Your timing</div>
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="celebrated_date">Celebrated date</label>
          <input
              class="input m-t-8"
              type="date"
              name="celebrated_date"
              id="celebrated_date"
              v-model="sendData['celebrated_date']"
          />
        </div>

        <div class="input-block c-2">
          <label class="p-small required" for="appointment_date">Appointment date</label>
          <input
              class="input m-t-8"
              type="date"
              name="appointment_date"
              id="appointment_date"
              v-model="sendData['appointment_date']"
          />
        </div>

        <div class="input-block c-4">
          <CheckBox
              :value="sendData['subscribe']"
              v-on:click="sendData['subscribe'] = !sendData['subscribe']"
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
  </div>
</template>

<script setup>
import CheckBox from "../components/filter/CheckBox";

import {getListOfCountries} from '~/api/stores'
import getCountryCode from '~/api/getCountryCode'
import {getCountry} from "~/api/stores";

const router = useRouter();
const route = useRoute();

const sendData = ref({
  name: '',
  surname: '',
  phone: '',
  email: '',

  country: route.query.country,
  city: route.query.city,
  store: route.query.store,

  celebrated_date: '',
  appointment_date: '',

  subscribe: false,



})



const loading = ref(false)

const countries = ref(await getListOfCountries('en'));

const cities = computed(() => {
  sendData.value.city = undefined
  return countryData?.value?.data?.attributes?.city
})
const stores = computed(() => {
  sendData.value.store = undefined
  const index = cities?.value?.findIndex((c) => c.name.toLowerCase() === sendData.value.city);
  if (index !== -1) {
    const s = cities?.value[index]
    if (s.length === 1) {
      sendData.value.store = c.name.toLowerCase() +  + ' (' + c.address.toLowerCase() + ')'
    }
    return s
  }
  return undefined
})

const {data: countryData, pending: pendingCountry, refresh: refreshCountry, error: errorCountry} = await useLazyAsyncData('country', () => getCountry(sendData.value.country,'en'), {
  transform: (d) => {
    return d.data['storeFinder']
  }
})

watch(() => sendData.value.country, () => {
  if (sendData.value.country === undefined) {
    // countryData.value = null
    return
  }
  refreshCountry()
})



function send() {
  console.log('send');
  loading.value = true
}

</script>

<style scoped>
select.input {
  -moz-appearance:none; /* Firefox */
  -webkit-appearance:none; /* Safari and Chrome */
  appearance:none;

  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M12.0001 15L7.75708 10.757L9.17208 9.343L12.0001 12.172L14.8281 9.343L16.2431 10.757L12.0001 15Z'/></svg>");
  background-repeat: no-repeat;
  background-position-x: calc(100% - 16px);
  background-position-y: 50%;
}
.checkbox {
  width: 24px;
  height: 24px;
  border-radius: 0!important;
}

</style>
