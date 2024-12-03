<template>
  <div>
    <div v-if="!pending">
      <InnerHeader v-if="step !== 0"
                   :sub_header="data.sub_header"
                   :title="data.title"
                   :sub_title="$t('warsaw_sub_title')"
                   :hideBorder="true"
                   :steps="step !==3 ? steps : null"
                   @step="(index) => goStep(index)"
                   :currentStep="step"
      />
      <Error :text="altegError" />
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
          :selectedDay="selectedDay" 
          :specials="data?.specials"
          @getHours="(day) => getHours(day)"
          @goStep="(payload) => goStep(2, payload)"
          />
      <FlagshipStepTwo 
        v-if="step === 2"
        @goStep="(index) => goStep(index)"
        @addAltegError="addAltegError"
        :isFirstFitting="selectedServiceId === services[0].service_id"
        :altegioRequestData="{
          type: 'appointment',
          date: selectedDate,
          staff_id: selectedStaffId,
          services_id: selectedServiceId
        }"
      />

      <Container size="0" marginVertical="40">
        <div class="col-12">
          <Fact :data="{background_color: 'light', logo: true, layout: 'wide'}" class="p-b-0">
            <div v-if="step===3" v-html="data.success" class="m-b-56"/>
            <div class="button-wrap">
              <NuxtLink :to="localePath('/')" class="button primary">{{ $t('back_home') }}</NuxtLink>
            </div>

            <div v-if="data.contact_title" class="subheader m-b-16">{{ data.contact_title }}</div>
            <div v-if="data.contact_address" class="m-b-8">
              <span class="icon-location-16"/>
              <a :href="(data.contact_address_url === null || data.contact_address_url === '') ? `http://maps.google.com/?q=${data.contact_address}` : data.contact_address_url" target="_blank" class="link normal m-l-8">{{ data.contact_address }}</a>
            </div>
            <div v-if="data.contact_phone" class="m-b-32">
              <span class="icon-phone-16"/>
              <a :href="`tel: ${data.contact_phone.replaceAll(' ', '').replaceAll('-', '').replaceAll(')', '').replaceAll('(', '')}`" target="_blank" class="link normal  m-l-8">{{ data.contact_phone }}</a>
            </div>
            
            <template v-if="data.social">
              <NuxtLink 
                v-for="(item, index) in data.social" 
                :class="`icon-${item.icon}${(data?.social?.length > index + 1 ? ' m-r-16' : '')}`" 
                :to="item.url" target="_blank"
                class="social hover"/>
            </template>
          </Fact>
        </div>
        <div v-if="step===2" class="image-wrap">
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

const { t, locale } = useI18n()
const step = ref(0)
const selectedServiceId = ref()
const bookingServices = ref()
const bookingStaff = ref()
const bookingDates = ref()
const bookingHours = ref()
const selectedStaffId = ref()
const selectedDay = ref()
const selectedDate = ref()
const consoleErrors = ref([])
const altegError = ref(null)

let { data, pending } = await getFlagship(locale.value)

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
    console.log('event-sent');
  }

  window.scroll({
    top: 0,
    behavior: "smooth"
  })
}

async function getServices() {
  altegError.value = null

  try {
    const servicesResponse = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "services",
      }
    })
    if (!servicesResponse.success) {throw servicesResponse.meta}


    bookingServices.value = servicesResponse?.data.filter(services => services.is_online);
    const staff = []
    bookingServices.value?.forEach(service => {
      service.staff?.forEach(st => staff.push(st.id))
    })

    // leave unique staff id
    bookingStaff.value = staff.filter(function(item, pos) {
      return staff.indexOf(item) == pos;
    })
    if (!bookingStaff.value || bookingStaff.value?.length === 0) {
      throw 'staff ids not found'
    }

  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)

    altegError.value = t("service_unavailable")
    bookingServices.value = []
  }
}

const addAltegError = (message) => altegError.value = message

const services = computed(() => {
  if (!bookingServices.value) return
  const ids = bookingServices.value.map(bookingService => bookingService.id);
  return data.value.servises.filter(service => ids.includes(service.service_id) && service.publish).reverse()
})

getServices()

const steps = computed(() => {
  return [
  {
    name: selectedServiceId.value === services.value?.[0].service_id ? t('book_step_1_first') : t('book_step_1_retry'),
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
]})

async function getDaysAndHours() {
  bookingDates.value = null
  bookingHours.value = null
  altegError.value = null

  try {
    const daysResponse = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "days",
        service_id: selectedServiceId.value,
        date_from: new Date(Date.now()).toLocaleDateString('en-CA'),
        date_to: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')
      }
    })
    
    if (!daysResponse.success) throw daysResponse.meta

    let datesObject = {}
    daysResponse?.data.booking_dates?.forEach(dayRes => {
      const fullDate = new Date(dayRes)
      const year = fullDate.getFullYear()
       const month = fullDate.getMonth()
       if (!datesObject[`${year}-${month}`]) {
         datesObject[`${year}-${month}`] = _getDaysInMonth(fullDate.getMonth(), fullDate.getFullYear())
       }
       datesObject[`${year}-${month}`][fullDate.getDate()-1] = {
         available: true,
         dayOfWeek: fullDate.getDay(),
         day: fullDate.getDate(),
         year: fullDate.getFullYear(),
         month: month,
         date: dayRes
       }
       if (!selectedDay.value) {
         selectedDay.value = dayRes
       }
     })

    getHours(selectedDay.value)

    bookingDates.value = datesObject
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
    const hoursResponse = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "hours",
        date: date,
        staff_ids: bookingStaff.value,
        service_id: selectedServiceId.value,
      }
    })
    if (!hoursResponse.success) throw hoursResponse.meta

    bookingHours.value = hoursResponse?.data

  } catch (e) {
    console.error(e);
    consoleErrors.value.push(e)

    altegError.value = t("service_unavailable")
  }
}

function _getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    const fullDate = new Date(date)
    days.push({
      dayOfWeek: fullDate.getDay(),
      day: fullDate.getDate(),
      year: fullDate.getFullYear(),
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

.button-wrap {
  margin: 0 auto 40px;
}

.image-wrap {
  width: 100%;
  height: 616px;
  overflow: hidden;
  background-image: url('/img/formSuccess.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
