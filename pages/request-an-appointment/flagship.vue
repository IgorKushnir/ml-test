<template>
  <div>
    <InnerHeader title="Book an appointment" sub_title="We're excited to invite you to our showroom and assist in discovering the main gown of your life! To find your dream dress for the big day, please select your appointment."/>

    <Container v-if="!selectedDate  && !sent" justify="justify-center">
      <div class="col-4">
        <div v-for="(month, index) in bookingDates">
          {{$getMonths[index][0]}}
          <div class="month">
            <div v-for="day in month"
                 class="day"
                 :class="(day.available ? 'available' : '') + ((selectedDay && day.date === selectedDay) ? ' active' : '')"
                 :style="`grid-column-start: ${day.dayOfWeek}`"
                 v-on:click="() => getHours(day.date)"
            >
              <div class="day-container">
                {{day.day}}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="col-4">
        {{selectedDay}}

        <div v-if="bookingHours?.length === 0">No available appointments on this day</div>
        <div class="hour-container m-b-8" v-for="hour in bookingHours">
          <div class="button hour-button" v-on:click="() => selectedDate = hour.datetime">{{hour.time}}</div>
        </div>

      </div>

    </Container>


    <Container v-if="selectedDate && !sent">
      <div class="button" v-on:click="() => selectedDate = 0">Back</div>
      {{selectedDate}}

      <form @submit.prevent="postRecord" class="col-6 form">
        <div class="input-block c-2">
          <label class="p-small required" for="name">Name</label>
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
          <label class="p-small required" for="surname">Surname</label>
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
          <label class="p-small required" for="email">Email</label>
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
          <label class="p-small required" for="phone">Phone number</label>
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
          <label class="p-small" for="wedding_date">Wedding date</label>
          <input
              v-model="userData.weddingDate"
              class="input m-t-8"
              type="date"
              name="wedding_date"
              id="wedding_date"
          />

        </div>

        <div class="input-block c-4">
          <label class="p-small" for="wedding_date">Number of people joining you</label>
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

          <FilterCheckBox
              :value="userData.consent"
              v-on:click="() => userData.consent = !userData.consent"
              label="Clicking this implies your consent to receive text messages regarding upcoming appointments, confirmations, and relevant information. MN values your privacy and ensures that your information won't be shared."
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
      {{userData}}
    </Container>

    <State v-if="sent" small title="THANK YOU!" text="Your request has been processed. Our manager will reach out to you shortly to confirm your reservation and address any further details if necessary." :button="{text: $t('book_home_page'), path: '/'}" />

  </div>
</template>

<script setup>
const { $getMonths } = useNuxtApp();

const sendingRequest = ref(false)

const bookingDates = ref()
const bookingHours = ref()
const selectedDay = ref()
const selectedDate = ref()
const sent = ref(false)
const userData = ref({
  name: "",
  surname: "",
  email: "",
  phone: "",
  weddingDate: "",
  people: 0,
  consent: false,
})


if (process.client) {
  getDays()
}

async function getDays() {
  try {
    const d = await $fetch('/api/alteg', {
      method: "POST",
      body: {
        type: "days"
      }
    })
    if (!d.success) return

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
    })

    bookingDates.value = bb
  } catch (e) {
    console.error(e);
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
        date: date
      }
    })
    if (d.success) {
      bookingHours.value = d.data
    }

  } catch (e) {
    console.error(e);
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
        phone: userData.value.phone,
        fullName: userData.value.name + ' ' + userData.value.surname,
        email: userData.value.email,
        comment: ("Number of people joining with " + userData.value.name + ": " + userData.value.people + ". ") + (userData.value.weddingDate ? ("Wedding Date: " + userData.value.weddingDate): "")
      }
    })
    if (d.success){
      sent.value = true
      console.log('booked');
    }

  } catch (e) {
    console.error(e);
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
.month {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.day {
  //background-color: $light-gray;
  /*border: 1px solid #4D4E56;*/
  //height: 48px;
  padding: 8px 0;
  //margin: .25px;
  //color: $gray;
  //opacity: .3;

}
.day.available {
  cursor: pointer;
}
.day > .day-container {
  border-radius: 50%;
  height: 72px;
  aspect-ratio: 1;
  margin-right: 0;
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;

}
.day.available > .day-container {
  background-color: rgba(122, 165, 186, 0.2);
  font-weight: bold;

}
.day.available:hover > .day-container {
  background-color: $blue;
  color: $white;
}

.day.active > .day-container {
  background-color: $dark-blue;
  color: $white;
  font-weight: bold;

}


.hour-button {
  display: block;
  width: 100%;
}
</style>
