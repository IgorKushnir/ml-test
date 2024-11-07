<template>
  <div>
<!--    <div class="errors">-->
<!--      <div v-for="error in consoleErrors"><pre>{{error}}</pre></div>-->
<!--    </div>-->
    <div v-if="!pending">
      <!--    Choose a service-->
      <!--    Select session date and time-->
      <InnerHeader v-if="step !== 0"
                   :sub_header="data.sub_header"
                   :title="data.title"
                   :steps="step !== 3 ? steps : null"
                   @step="(index) => goStep(index)"
                   :currentStep="step"
      />

      <Error :text="altegError"/>

      <FlagshipStepOne
          v-if="step === 0"
          @serviceId="(id) => goStep(1, id)"
          :sub_header="data.sub_header"
          :title="data.title"
          :cover="data.cover_4x3"
          :text="data.description"
          :services="services"
          :content="data?.content"/>

      <FlagshipDayHour v-if="step === 1"
                       :bookingDates="bookingDates"
                       :bookingHours="bookingHours"
                       @getHours="((day) => getHours(day))"
                       @goStep="(payload) => goStep(2, payload)"
                       :selectedDay="selectedDay"
                       :specials="data?.specials"
      />


      <Container v-if="step === 2" justify="justify-center">
        <!--      <div class="button" v-on:click="() => selectedDate = 0">Back</div>-->
        <!--      {{selectedDate}}-->

        <form @submit.prevent="postRecord" class="col-6 col-8-xl col-12-md form">
          <div class="input-block c-2" :class="userData.name.error ? 'error' : ''">
            <label class="p-small required" for="name">{{ $t('book_first_name') }}</label>
            <input
                autofocus
                required
                v-model="userData.name.value"
                class="input m-t-8"
                type="text"
                name="name"
                id="name"
            />
            <label v-if="true" for="name" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>
          <div class="input-block c-2"  :class="userData.surname.error ? 'error' : ''">
            <label class="p-small required" for="surname">{{ $t('book_last_name') }}</label>
            <input
                required
                v-model="userData.surname.value"
                class="input m-t-8"
                type="text"
                name="surname"
                id="surname"
            />
            <label v-if="true" for="surname" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4" :class="userData.email.error ? 'error' : ''">
            <label class="p-small required" for="email">{{ $t('book_email') }}</label>
            <input
                required
                v-model="userData.email.value"
                class="input m-t-8"
                type="email"
                name="email"
                id="email"
            />
            <label v-if="true" for="email" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4" :class="userData.phone.error ? 'error' : ''">
            <label class="p-small required" for="phone">{{ $t('book_phone_number') }}</label>
            <input
                required
                v-model="userData.phone.value"
                class="input m-t-8"
                type="tel"
                name="phone"
                id="phone"
            />

            <label v-if="true" for="phone" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4">
            <label class="p-small" for="wedding_date">{{ $t('book_celebrated_date') }}</label>
            <input
                v-model="userData.weddingDate.value"
                class="input m-t-8"
                type="date"
                name="wedding_date"
                id="wedding_date"
            />
            <label v-if="true" for="wedding_date" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4">
            <label class="p-small" for="people">{{ $t("book_number_of_people") }}</label>
            <select
                class="input m-t-8"
                name="people"
                id="people"
                v-model="userData.people.value"
            >
              <option :value="0" selected>0</option>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
            </select>
            <label v-if="true" for="people" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4">
            <label class="p-small" for="find_out">{{ $t("book_find_out") }}</label>
            <select
                class="input m-t-8"
                name="find_out"
                id="find_out"
                v-model="userData.find_out.value"
            >
              <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="Instagram">Instagram</option>
              <option value="Tik Tok">Tik Tok</option>
              <option value="Pinterest">Pinterest</option>
              <option value="Google">Google</option>
              <option value="Ad">Ad</option>
              <option value="Trunk Show">Trunk Show</option>
              <option value="Word of mouth ">Word of mouth </option>
            </select>
            <label v-if="true" for="find_out" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-4" id="consent"  :class="userData.consent.error ? 'error' : ''">

            <FilterCheckBox
                :value="userData.consent.value"
                v-on:click="() => userData.consent.value = !userData.consent.value"
                :label="$t('book_consent')"
                available
            />
            <label v-if="true" for="consent" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="c-4 m-v-24 center">
            <div class="button primary" :class="sendingRequest ? 'loading' : ''" v-on:click="postRecord">
              <transition name="fade" mode="out-in">
                <span v-if="!sendingRequest">{{ $t('book_send') }}</span>
                <Spinner v-else white/>
              </transition>
            </div>
          </div>

        </form>
        <!--      {{userData}}-->
      </Container>

      <Container>
        <div class="col-12">
          <Fact :data="{background_color: 'light', logo: true, layout: 'wide'}">
            <div v-if="step===3" v-html="data.success" class="m-b-56"/>
            <div v-if="data.contact_title" class="subheader m-b-16">{{ data.contact_title }}</div>
            <div v-if="data.contact_address" class="m-b-8">
              <span class="icon-location-16"/>
              <a :href="(data.contact_address_url === null || data.contact_address_url === '') ? 'http://maps.google.com/?q='+data.contact_address : data.contact_address_url" target="_blank" class="link normal m-l-8">{{ data.contact_address }}</a>
            </div>
            <div v-if="data.contact_phone" class="m-b-32">
              <span class="icon-phone-16"/>
              <a :href="'tel: '+data.contact_phone.replaceAll(' ', '').replaceAll('-', '').replaceAll(')', '').replaceAll('(', '')" target="_blank" class="link normal  m-l-8">{{ data.contact_phone }}</a>
            </div>

            <template v-if="data.social">
              <NuxtLink v-for="(item, index) in data.social" :class="'icon-'+item.icon + (data?.social?.length > index+1 ? ' m-r-16' : '')" :to="item.url" target="_blank"
                        class="social hover"/>
            </template>
          </Fact>
        </div>
      </Container>
    </div>

    <Seo
        :data="data"
        :title="data?.title"
        :breadcrumbs="[
        {
          title: data?.title,
        }
    ]"
        :localizations="[{locale: 'en', slug: 'warsaw'}, {locale: 'pl', slug: 'warszawa'}]"
    />

  </div>
</template>

<script setup>
import getFlagship from '~/api/getFlagship'
import phoneCodes from '~/api/phoneCodes.json'

const { t,locale } = useI18n()

const { $validateEmail } = useNuxtApp();

const sendingRequest = ref(false)
const step = ref(0)

const bookingServices = ref()
const bookingStaff = ref()
const bookingDates = ref()
const bookingHours = ref()
const selectedStaffId = ref()
const selectedServiceId = ref()
const selectedDay = ref()
const selectedDate = ref()

const userData = ref({
  name: {value: "", error: false, required: true},
  surname: {value: "", error: false, required: true},
  email: {value: "", error: false, required: true},
  phone: {value: "", error: false, required: true},
  weddingDate: {value: "", error: false},
  people: {value: 0, error: false},
  find_out: {value: null, error: false},
  consent: {value: false, error: false, required: true},
})

const steps = ref([
  {
    name: t('book_step_1'),
    active: false
  },
  {
    name: t('book_step_2'),
    active: false
  },
  {
    name: t('book_step_3'),
    active: false
  },
])

const services = [
  {
    service_id: 0,
    title: $t("wedding_dresses")
  },
  {
    service_id: 1,
    title: $t("evening_dresses")
  }
]

const consoleErrors = ref([])
const altegError = ref(null)

let { data, pending, refresh, error } = await getFlagship(locale.value)


function goStep(_step, payload) {
  step.value = _step
  if (_step === 1) {
    if (payload) {
      selectedServiceId.value = payload
    }
    getDaysAndHours()
  }
  if (_step === 2) {
    if (payload) {
      selectedDate.value = payload.datetime
      selectedStaffId.value = payload.staff_id
    }

  }
  if (_step === 3) {
    fbq('track', 'Lead');  // Pixel??
    if (process.env.GTAG_KEY && gtag) {
      gtag('event', 'success_form', {
      'send_to': `${process.env.GTAG_KEY}/E3k4COnnw5cZELm1yqY9`,
      peopleJoinWithMe: userData.value.people,
      howDidIFindOut: userData.value.find_out ?? 'null'
    });
    console.log('event-sent');
  }
  }

  window.scroll({
    top: 0,
    behavior: "smooth"
  })
}
async function getDaysAndHours() {
  bookingDates.value = null
  bookingHours.value = null
  altegError.value = null

  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "days",
        service_id: selectedServiceId.value,
        date_from: new Date(Date.now()).toLocaleDateString('en-CA'),
        date_to: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')
      }
    })
    if (!d.success) throw d.meta

    let bb = {}
     d?.data.booking_dates?.forEach(d => {
      const _d = new Date(d)
      const year = _d.getFullYear()
       const month = _d.getMonth()
       if (!bb[`${year}-${month}`]) {
         bb[`${year}-${month}`] = _getDaysInMonth(_d.getMonth(), _d.getFullYear())
       }
       bb[`${year}-${month}`][_d.getDate()-1] = {
         available: true,
         dayOfWeek: _d.getDay(),
         day: _d.getDate(),
         year: _d.getFullYear(),
         month: month,
         date: d
       }
       if (!selectedDay.value) {
         selectedDay.value = d
       }
     })

    getHours(selectedDay.value)

    bookingDates.value = bb
  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)

    altegError.value = t("service_unavailable")
  }
}
async function getHours(date) {
  selectedDay.value = date
  bookingHours.value = null
  altegError.value = null
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "hours",
        date: date,
        staff_ids: bookingStaff.value,
        service_id: selectedServiceId.value,
      }
    })
    if (!d.success) throw d.meta

    bookingHours.value = d?.data

  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)

    altegError.value = t("service_unavailable")
  }
}
async function postRecord() {
  altegError.value = null

  const fields = Object.keys(userData.value)
  const errors = []
  fields?.forEach(field => {
    if (userData.value[field].required) {
      if (field === 'consent') {
        userData.value[field].value === false ? (userData.value[field].error = true, errors.push(field)) : userData.value[field].error = false
      } else {
        userData.value[field].value === '' ? (userData.value[field].error = true, errors.push(field)) : userData.value[field].error = false
      }

    }
  })
  // console.log(fields, errors);

  if (errors?.length > 0) {
    const yOffset = -40;
    const element = document.getElementById(errors[0]);
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});

    return
  }


  sendingRequest.value = true
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "appointment",
        date: selectedDate.value,
        staff_id: selectedStaffId.value,
        services_id: selectedServiceId.value,
        phone: userData.value.phone.value,
        fullName: userData.value.name.value + ' ' + userData.value.surname.value,
        email: userData.value.email.value,
        comment: ("Number of people joining with " + userData.value.name.value + ": " + userData.value.people.value + ". ") + (userData.value.weddingDate.value ? ("Wedding Date: " + userData.value.weddingDate.value): "") + (userData.value.find_out.value ? ('. Found out: '+userData.value.find_out.value) : '')
      }
    })
    if (!d.success) throw d.meta

    goStep(3)


  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)
    altegError.value = t("service_unavailable")
  }

  sendingRequest.value = false
}



function _getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    const _d = new Date(date)
    days.push({
      dayOfWeek: _d.getDay(),
      day: _d.getDate(),
      year: _d.getFullYear(),
      month: month,
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
}


watch(() => userData.value.phone.value, (phone) => {
  if (phone?.length === 0) phone = '+'
  if (phone[0] !== '+') phone = '+'.concat(phone.slice(1))

  phone = phone.replace(/[^+0-9]/g, "")
  userData.value.phone.value = phone
})

function setCountryCode(countryCode) {
  const index = phoneCodes.findIndex(l => l.code === countryCode)
  if (index && index !== -1) {
    userData.value.phone.value = phoneCodes[index].dial_code
  }
}

import getCountryCode from "../api/getCountryCode";

onMounted(async () => {
  let countryCode = await getCountryCode()
  setCountryCode(countryCode === 'null' ? 'US' : countryCode)
})
</script>

<style scoped lang="scss">



.errors {
  position: fixed;
  z-index: 100;
  font-size: 10px;
  background-color: #ffeaea;
}


.social {
  margin: 16px 8px;
  font-size: 20px;
  height: 24px;
  display: inline-block;
  width: 24px;
  padding: 2px;
}
@include md {
  .social {
    margin: 4px;
    font-size: 22px;
    height: auto;
    width: auto;
    padding: 12px;
  }
}
</style>
