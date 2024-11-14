<template>

  <Container  justify="justify-center">
    <div class="col-4 col-6-xl col-8-md col-12-sm p-t-0 p-t-24-xl relative">
      <div class="h4 m-b-24 m-t-0">{{ $t("choose_a_day") }}</div>
      <div class="shine" v-if="!bookingDates"/>
      <div class="calendar-nav">
        <div ref="prev" class="prev"><div class="icon-arrow-16 back"/></div>
        <div  v-if="bookingDates" class="calendar-date">{{ $t($getMonths[currentMonthIndex][0]) }} {{currentYear}}</div>
        <div  v-else class="calendar-date"/>
        <div ref="next" class="next"><div class="icon-arrow-16"/></div>
      </div>
      <div class="calendar-days m-t-16">
        <div class="subheader small center">{{ $t('Mon') }}</div>
        <div class="subheader small center">{{ $t('Tue') }}</div>
        <div class="subheader small center">{{ $t("Wen") }}</div>
        <div class="subheader small center">{{ $t("Thu") }}</div>
        <div class="subheader small center">{{ $t("Fri") }}</div>
        <div class="subheader small center">{{ $t("Sat") }}</div>
        <div class="subheader small center">{{ $t("Sun") }}</div>
      </div>
      <div ref="calendarEl" class="swiper" style="overflow: visible;">
        <div class="swiper-wrapper">

          <div v-for="(month, index) in !bookingDatesWithSpecials ? placeholderDates : bookingDatesWithSpecials" class="swiper-slide">
            <div class="month">
              <div v-for="day in month"
                   class="day"
                   :class="(day.available ? 'available' : '') +
               ((selectedDay && day.date === selectedDay) ? ' active' : '') +
               (isToday(day.date) ? ' current-day' : '')"
                   :style="`grid-column-start: ${day.dayOfWeek}`"
                   v-on:click="() => day.available ? getHours(day.date) : null"
              >
                <div class="day-container">
                  <div class="specials" v-if="day.specials?.length > 0">
                    <div class="tooltip-wrapper">
                      <div class="tooltip">
                        <div v-for="special in day.specials">
                          <template v-if="special.inRange">
                            <span class="ico"></span>{{special.name}}
                          </template>
                        </div>
                      </div>
                    </div>

                    <template v-for="special in day.specials">
                      <div class="special" v-if="special.inRange" :class="special.inRange + ' ' + special.position"></div>
                    </template>
                  </div>

                  <span class="p-small relative">{{day.day}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-t-16">
        <div v-for="special in specials" class="legend p-small"><span class="ico"></span>{{ special.name }}</div>
      </div>
    </div>


<!--    <pre>{{bookingHoursTransformed}}</pre>-->
    <div class="col-4 col-6-xl col-8-md col-12-sm p-t-0 p-t-24-xl relative" id="timeslot">
      <div class="h4 m-b-24 m-t-0">{{ $t("choose_a_timeslot") }}</div>
      <div class="shine" v-if="!bookingHours"/>
      <!--      {{selectedDay}}-->

      <div v-if="bookingHours?.length === 0">No available appointments on this day</div>
      <div v-else  v-for="hourSlots in !bookingHours ? placeholderHours : bookingHoursTransformed" class="hour-slots m-b-8">
        <div v-for="hour in hourSlots" class="hour" :class="bookingHours ? 'available' : ''">
          <div class="hour-container" v-on:click="() => bookingHours ? goStep(hour) : null">
            <span class="p-small">{{hour.time}}</span>

<!--            {{hour.seance_length/60/60}}-->
            <div class="icon-arrow-16"/>
          </div>
<!--          {{hour}}-->

<!--          {{hour.staff_id}}-->
        </div>
      </div>

    </div>

  </Container>
</template>

<script setup>
import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'

const { $getMonths } = useNuxtApp();
const emits = defineEmits(['getHours', 'goStep'])

const props = defineProps({
  bookingDates: {
    type: Object
  },
  bookingHours: {
    type: Array
  },
  selectedDay: {
    type: String
  },
  specials: {
    type: Object
  }
})
// const loadingDates = ref(true)
// const loadingHours = ref(true)
const placeholderDates = [
  [
    {"dayOfWeek": 1},
    {"dayOfWeek": 2},
    {"dayOfWeek": 3},
    {"dayOfWeek": 4},
    {"dayOfWeek": 5},
    {"dayOfWeek": 6},
    {"dayOfWeek": 7},
    {"dayOfWeek": 1},
    {"dayOfWeek": 2},
    {"dayOfWeek": 3},
    {"dayOfWeek": 4},
    {"dayOfWeek": 5},
    {"dayOfWeek": 6},
    {"dayOfWeek": 7},
    {"dayOfWeek": 1},
    {"dayOfWeek": 2},
    {"dayOfWeek": 3},
    {"dayOfWeek": 4},
    {"dayOfWeek": 5},
    {"dayOfWeek": 6},
    {"dayOfWeek": 7},
    {"dayOfWeek": 1},
    {"dayOfWeek": 2},
    {"dayOfWeek": 3},
    {"dayOfWeek": 4},
    {"dayOfWeek": 5},
    {"dayOfWeek": 6},
    {"dayOfWeek": 7},
    {"dayOfWeek": 1},
    {"dayOfWeek": 2},
    {"dayOfWeek": 3},
    {"dayOfWeek": 4},
    {"dayOfWeek": 5},
    {"dayOfWeek": 6},
    {"dayOfWeek": 7},
  ]
]
const placeholderHours = [
  [{}],
  [{}],
  [{}],
  [{}],
  [{}],
  [{}],
  [{}],
  [{}],
  ]
const swiperCalendar = ref()
const calendarEl = ref()
const next = ref()
const prev = ref()

const currentCalendarIndex = ref(0)
const currentMonthIndex = computed(() => {
  if (!props.bookingDates) return
  const indexes = Object.keys(props.bookingDates).map(date => date.split('-')[1])
  return indexes[currentCalendarIndex.value]
})

const bookingHoursTransformed = computed(() => {
  let transformed = []
  const hours = []
  props.bookingHours?.forEach(hour => {
    const h = hour.time.split(':')[0]
    if (!hours.includes(h)) {
      transformed.push([hour])
    } else {
      transformed[transformed?.length-1].push(hour)
    }
    hours.push(h)
  })
  return transformed
})


const bookingDatesWithSpecials = computed(() => {
  if (!props.bookingDates) return
  const bd = props.bookingDates
  if (props.specials?.length > 0) {
    Object.keys(bd)?.forEach((month) => {
      bd[month]?.forEach((dayData, dayIndex) => {
        // console.log(bd[month][dayIndex]);
        const sp = props.specials.map(special => {
          return isDateInRange(dayData, special)
        })
        if ((sp.map(s => s.inRange) ?? []).includes(true)) {
          bd[month][dayIndex].specials =  sp
        }
      })
    })
  }

  return bd
})

const currentYear = computed(() => props?.bookingDates ? Object.keys(props.bookingDates)[0].year : "")

function isToday(date) {
  return new Date().toISOString().split('T')[0] === date
}
function isDateInRange(day, special) {
  const {from, to, name} = special
  const date = day.date ?? (day.year+"-"+((day.month+1) < 10 ? '0'+(day.month+1) : (day.month+1))+"-"+(day.day < 10 ? '0'+day.day : day.day));
  const inputDate = new Date(date);
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(inputDate) || isNaN(fromDate) || isNaN(toDate)) {
    console.error(("Invalid date format. Please use 'YYYY-MM-DD'."));
    return { inRange: false, position: null, name: null }
    // throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
  }

  if (inputDate < fromDate || inputDate > toDate) {
    return { inRange: false, position: null, name: null };
  } else if (inputDate.getTime() === fromDate.getTime()) {
    return { inRange: true, position: 'first', name };
  } else if (inputDate.getTime() === toDate.getTime()) {
    return { inRange: true, position: 'last', name };
  } else {
    return { inRange: true, position: 'middle', name };
  }
}
function getHours(date) {
  if (useIsMobile().value) {
    const body = document.body;
    const section = document.getElementById('timeslot');
    const sectionTop = section.getBoundingClientRect().top - body.getBoundingClientRect().top - 40;

    window.scroll({
      top: sectionTop,
      behavior: "smooth"
    })
  }

  emits('getHours', date)
}
function goStep(hours) {
  emits('goStep', hours)
}


onMounted(() => {
  const interval = setInterval(() => {
    if (props.bookingDates) {
      initSwiper()
      clearInterval(interval)
    }
  },100)
})
function initSwiper() {
  swiperCalendar.value = new Swiper(calendarEl.value, {
    // slidesPerView: brakePoints[props.column][4],
    spaceBetween: 20,
    allowTouchMove: false,

    navigation: {
      nextEl: next.value,
      prevEl: prev.value,
    },

    on: {
      slideChange: () => {
        currentCalendarIndex.value = swiperCalendar.value.activeIndex;
      },
      // init: function () {
      //   console.log('dg');
      //
      //   // show.value = true;
      // },
    },
  })
}

</script>

<style scoped lang="scss">
.button-arrow {
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 16px;
  top: calc(50% - 20px);
  opacity: 0;
  transition: .5s ease-in-out opacity;
  z-index: 6;
}

.month {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.icon-arrow-16.back {
  transform: scaleX(-1);
}
.day.available, .hour.available {
  cursor: pointer;
}

.day > .day-container {
  aspect-ratio: 1;
}
.hour {
  width: 100%;
}
.hour-slots {
  display: flex;
  gap: 8px;
}
.hour > .hour-container {
  //aspect-ratio: 8;
  padding: 16px;


}
.day > .day-container, .hour > .hour-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $light-gray;
  color: rgba($gray, 0.3);
  .icon-arrow-16 {
    width: 0;
    overflow: hidden;
    transition: .3s;
  }
}
.day.available > .day-container, .hour.available > .hour-container {
  background-color: $white;
  font-weight: bold;
  border: 1px solid $border-dark;
  color: $dark-blue;
}
.day.available:hover > .day-container, .hour.available:hover > .hour-container {
  background-color: $light-gray;
  border-color: $gray;
  .icon-arrow-16 {
    width: 16px;
    margin-left: 8px;
  }
}
.day.active.available:hover > .day-container, .hour.active.available:hover > .hour-container {
  background-color: $dark-blue;
}
.day.active > .day-container, .hour.active > .hour-container {
  background-color: $dark-blue;
  color: $white;
  font-weight: bold;
  border: unset;
}

.day.current-day > .day-container:after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  //background-color: $dark-blue;
  background-color: rgba($gray, 0.3);
  border-radius: 50%;
  bottom: 10px;
}
.day.available.current-day > .day-container:after {
  background-color: $dark-blue
}

.day.active.current-day > .day-container:after {
  background-color: $white
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-nav {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-nav > .calendar-date {
  grid-column-start: 2;
  grid-column-end: 7;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $light-gray;
}

.prev, .next {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $white;
  border: 1px solid $border-dark;
  cursor: pointer;
}
.prev:hover, .next:hover {
  background-color: $light-gray;
  border-color: $gray;
}

.prev.swiper-button-disabled, .next.swiper-button-disabled {
  background-color: $light-gray;
  color: rgba($gray, 0.3);
  cursor: unset;
  border-color: $light-gray;
}
.prev.swiper-button-disabled:hover, .next.swiper-button-disabled:hover {
  background-color: $light-gray;
  border-color: $light-gray;
}


.specials {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
  height: 100%;
  z-index: 0;
  padding: 8px;
}
.special {
  background-color: $blue;
  width: 8px;
  height: 8px;
  opacity: 1;
  border-radius: 50%;
}

.special.false {
  visibility: hidden;
}
@include md {
  .specials {
    padding: 4px;
  }
  .special.true {
    width: 6px;
    height: 6px;
  }
}
//.special.first {
//  border-top-left-radius: 24px;
//  border-bottom-left-radius: 24px;
//}
//.special.last {
//  border-top-right-radius: 24px;
//  border-bottom-right-radius: 24px;
//}
@media (hover: hover) {
     .day-container:hover > .specials > .tooltip-wrapper {
       display: flex;
     }
}
.tooltip-wrapper {
  position: absolute;
  top: -104px;
  left: -4px;
  height: 100px;
  max-height: 100px;
  align-items: flex-end;
  //display: flex;
  display: none;
}
.tooltip {
  background-color: $dark-blue;
  color: $white;

  font-size: 10px;
  padding: 4px;
  border-radius: 8px;
  white-space: nowrap;
}
.tooltip > div > .ico {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: $blue;
  border-radius: 50%;
  margin-right: 4px;
}

.tooltip > div:nth-child(2) > .ico, .special:nth-child(3), .legend:nth-child(2) > .ico {
  background-color: $gold;
}
.tooltip > div:nth-child(3) > .ico, .special:nth-child(4), .legend:nth-child(3) > .ico{
  background-color: $pink;
}

.legend > .ico {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: $blue;
  border-radius: 50%;
  margin-right: 8px;
}

.relative {
  position: relative;
  overflow: hidden;
}
.shine {
  position: absolute;
  width: 100%;
  height: 500px;
  z-index: 2;
  //background: #000000;
  background-image: linear-gradient(-90deg, rgba(255, 255, 255, 0) 0%, #fff 50%, rgba(255, 255, 255, 0) 60%);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: inline-block;
  //position: relative;

  //animation: placeholderShimmer 1s infinite linear;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-fill-mode: forwards;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-name: placeholderShimmer;
  -webkit-animation-timing-function: linear;
}

@keyframes placeholderShimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

</style>
