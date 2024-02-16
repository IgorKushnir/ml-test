<template>
  <div>
    <pre>{{// data.servises}}</pre>
    <div class="errors">
      <div v-for="error in consoleErrors"><pre>{{error}}</pre></div>
    </div>
<!--    Choose a service-->
<!--    Select session date and time-->
    <InnerHeader v-if="step !== 0"
                 sub_header="Flashstore"
                 title="Book an appointment"
                 :steps="step !== 3 ? steps : null"
                 @step="(index) => goStep(index)"
                 :currentStep="step"
    />

    <FlagshipStepOne
        v-if="step === 0"
        @serviceId="(id) => goStep(1, id)"
        :sub_header="data.sub_header"
        :title="data.title"
        :cover="data.cover_4x3"
       :text="data.description"
       :services="bookingServices"/>

    <FlagshipDayHour v-if="step === 1"
                     :bookingDates="bookingDates"
                     :bookingHours="bookingHours"
                     @getHours="((day) => getHours(day))"
                     @goStep="(payload) => goStep(2, payload)"
                     :selectedDay="selectedDay"
    />


    <Container v-if="step === 2" justify="justify-center">
<!--      <div class="button" v-on:click="() => selectedDate = 0">Back</div>-->
<!--      {{selectedDate}}-->

      <form @submit.prevent="postRecord" class="col-6 col-8-xl col-12-md form">
        <div class="input-block c-2">
          <label class="p-small required" for="name">{{ $t('book_first_name') }}</label>
          <input
              autofocus
              required
              v-model="userData.name"
              class="input m-t-8"
              type="text"
              name="name"
              id="name"
          />
        </div>
        <div class="input-block c-2">
          <label class="p-small required" for="surname">{{ $t('book_last_name') }}</label>
          <input
              required
              v-model="userData.surname"
              class="input m-t-8"
              type="text"
              name="surname"
              id="surname"
          />
        </div>

        <div class="input-block c-4">
          <label class="p-small required" for="email">{{ $t('book_email') }}</label>
          <input
              required
              v-model="userData.email"
              class="input m-t-8"
              type="email"
              name="email"
              id="email"
          />
        </div>

        <div class="input-block c-4">
          <label class="p-small required" for="phone">{{ $t('book_phone_number') }}</label>
          <input
              required
              v-model="userData.phone"
              class="input m-t-8"
              type="tel"
              name="phone"
              id="phone"
          />
        </div>

        <div class="input-block c-4">
          <label class="p-small" for="wedding_date">{{ $t('book_celebrated_date') }}</label>
          <input
              v-model="userData.weddingDate"
              class="input m-t-8"
              type="date"
              name="wedding_date"
              id="wedding_date"
          />

        </div>

        <div class="input-block c-4">
          <label class="p-small" for="wedding_date">{{ $t("book_number_of_people") }}</label>
          <select
              class="input m-t-8"
              name="wedding_date"
              id="wedding_date"
              v-model="userData.people"
          >
            <option :value="0" selected>0</option>
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </div>

        <div class="input-block c-4">
          <label class="p-small" for="find_out">{{ $t("book_find_out") }}</label>
          <select
              class="input m-t-8"
              name="find_out"
              id="find_out"
              v-model="userData.find_out"
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
        </div>

        <div class="input-block c-4">

          <FilterCheckBox
              :value="userData.consent"
              v-on:click="() => userData.consent = !userData.consent"
              :label="$t('book_consent')"
              available
          />
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
          <div v-if="data.contact_title" class="subheader">{{ data.contact_title }}</div>
          <div v-if="data.contact_address" class="m-b-8">
            <span class="icon-location-16"/>
            <a :href="'http://maps.google.com/?q='+data.contact_address" target="_blank" class="link normal m-l-8">{{ data.contact_address }}</a>
          </div>
          <div v-if="data.contact_phone" class="m-b-32">
            <span class="icon-phone-16"/>
            <a :href="'tel: '+data.contact_phone.replaceAll(' ', '').replaceAll('-', '').replaceAll(')', '').replaceAll('(', '')" target="_blank" class="link normal  m-l-8">{{ data.contact_phone }}</a>
          </div>

          <NuxtLink v-for="item in data.social" :class="'icon-'+item.icon" :to="item.url" target="_blank"
                    class="social hover m-r-16 m-h-8-md m-b-16"/>
        </Fact>
      </div>
    </Container>
  </div>
</template>

<script setup>
import getFlagship from '~/api/getFlagship'

const { t,locale } = useI18n()

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
  name: "",
  surname: "",
  email: "",
  phone: "",
  weddingDate: "",
  people: 0,
  find_out: null,
  consent: false,
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

const consoleErrors = ref([])

let { data, pending, refresh, error } = await getFlagship(locale.value)

if (process.client) {
  // getDaysAndHours()
  getServices()
}

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

  window.scroll({
    top: 0,
    behavior: "smooth"
  })
}
async function getServices() {
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "services",
      }
    })
    if (!d.success) throw d.meta


    bookingServices.value = d.data.filter(services => services.is_online);
    const staff = []
    bookingServices.value.forEach(service => {
      service.staff.forEach(st => staff.push(st.id))
    })

    // leave unique staff id
    bookingStaff.value = staff.filter(function(item, pos) {
      return staff.indexOf(item) == pos;
    })

  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)
  }
}
async function getDaysAndHours() {
  bookingDates.value = null
  bookingHours.value = null
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "days",
        service_id: selectedServiceId.value
      }
    })
    if (!d.success) throw d.meta

    let bb = {}
     d.data.booking_dates.forEach(d => {
      const _d = new Date(d)
       const month = _d.getMonth()
       if (!bb[month]) {
         bb[month] = _getDaysInMonth(_d.getMonth(), _d.getFullYear())
       }
       bb[month][_d.getDate()-1] = {
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
  }
}
async function getHours(date) {
  selectedDay.value = date
  bookingHours.value = null
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
    if (!d.success) d.meta

    bookingHours.value = d.data

  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)
  }
}
async function postRecord() {
  sendingRequest.value = true
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "appointment",
        date: selectedDate.value,
        staff_id: selectedStaffId.value,
        services_id: selectedServiceId.value,
        phone: userData.value.phone,
        fullName: userData.value.name + ' ' + userData.value.surname,
        email: userData.value.email,
        comment: ("Number of people joining with " + userData.value.name + ": " + userData.value.people + ". ") + (userData.value.weddingDate ? ("Wedding Date: " + userData.value.weddingDate): "") + (userData.value.find_out ? ('. Found out: '+userData.value.find_out) : '')
      }
    })
    if (!d.success) throw d.meta

    goStep(3)


  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)
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



</script>

<style scoped lang="scss">



.errors {
  position: fixed;
  z-index: 100;
  font-size: 10px;
  background-color: #ffeaea;
}
</style>
