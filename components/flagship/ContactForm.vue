<template>
    <form v-if="userData" @submit.prevent="postRecord" class="col-8 col-12-md form">
          <div class="input-block c-2" :class="userData.firstName.error ? 'error' : ''">
            <label class="p-small required" for="firstName">{{ $t('book_first_name') }}</label>
            <input
                required
                v-model="userData.firstName.value"
                class="input m-t-16"
                type="text"
                name="firstName"
                id="firstName"
            />
            <label for="firstName" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>
          <div class="input-block c-2"  :class="userData.lastName.error ? 'error' : ''">
            <label class="p-small required" for="lastName">{{ $t('book_last_name') }}</label>
            <input
                required
                v-model="userData.lastName.value"
                class="input m-t-16"
                type="text"
                name="lastName"
                id="lastName"
            />
            <label for="lastName" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.email.error ? 'error' : ''">
            <label class="p-small required" for="email">{{ $t('book_email') }}</label>
            <input
                required
                v-model="userData.email.value"
                class="input m-t-16"
                type="email"
                name="email"
                id="email"
            />
            <label for="email" class="error-message">{{ $t('book_error_email') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.phone.error ? 'error' : ''">
            <label class="p-small required" for="phone">{{ $t('book_phone_number') }}</label>
            <input
                required
                v-model="userData.phone.value"
                class="input m-t-16"
                type="tel"
                name="phone"
                id="phone"
            />

            <label for="phone" class="error-message">{{ $t('book_error_phone') }}</label>
          </div>

          <div v-if="isFirstFitting" class="input-block c-2" :class="userData.instagram.error ? 'error' : ''">
            <label class="p-small" for="email">{{ $t('instagram') }}</label>
            <input
                v-model="userData.instagram.value"
                class="input m-t-16"
                type="text"
                name="instagram"
                id="instagram"
            />
            <label for="instagram" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.weddingDate.error ? 'error' : ''">
            <label class="p-small required" for="weddingDate">{{ $t('book_celebrated_date') }}</label>
            <input
                v-model="userData.weddingDate.value"
                required
                class="input m-t-16"
                type="date"
                name="weddingDate"
                id="weddingDate"
            />
            <label for="weddingDate" class="error-message">{{ $t('book_error_wedding_date') }}</label>
          </div>

          <div class="input-block c-2">
            <label class="p-small" for="people">{{ $t("book_number_of_people") }}</label>
            <select
                class="input m-t-16"
                name="people"
                id="people"
                v-model="userData.people.value"
            >
              <option :value="0" selected>0</option>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
            </select>
            <label for="people" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <FilterRadio
          v-if="isFirstFitting"
          v-model="userData.dressSize.value"
          name="dressSize"
          :title="$t('dress_size')"
          :subtitle="$t('dress_size_subtitle')"
          required
          :error="userData.dressSize.error"
          :errorText="$t('book_error_empty_field')"
          :items="sizeItems"
          />

          <FilterRadio
          v-if="isFirstFitting"
          v-model="userData.budget.value"
          name="budget"
          :title="$t('budget')"
          required
          :error="userData.budget.error"
          :errorText="$t('book_error_empty_field')"
          :items="budgetItems"
          />

          <FilterRadio
          v-model="userData.preferredContact.value"
          name="preferredContact"
          :title="$t('preferred_contact')"
          required
          :error="userData.preferredContact.error"
          :errorText="$t('book_error_empty_field')"
          :items="contactItems"
          />

          <div class="input-block c-4" :class="userData.models.error ? 'error' : ''">
            <label class="p-small" for="models">{{ $t('dress_list') }}</label>
            <p class="p-small subtitle">{{ $t('dress_list_subtitle') }}</p>
            <textarea
                v-model="userData.models.value"
                class="input m-t-16"
                type="text"
                name="models"
                id="models"
            />
            <label for="models" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <FilterCheckboxCards
          v-if="isFirstFitting"
          :modelValue="userData.findOut.value"
          :title="$t('book_find_out')"
          :items="findOutItems"
          name="findOut"
          @updateValue="updatefindOutValue"
          />

          <div class="input-block c-4" id="consent"  :class="userData.consent.error ? 'error' : ''">

            <FilterCheckBox
                :value="userData.consent.value"
                v-on:click="() => userData.consent.value = !userData.consent.value"
                :label="$t('book_consent')"
                available
            />
            <label for="consent" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="c-4 m-v-24 center">
            <div class="button primary submit-button" :class="sendingRequest ? 'loading' : ''" v-on:click="postRecord">
              <transition name="fade" mode="out-in">
                <span v-if="!sendingRequest">{{ $t('book_send') }}</span>
                <Spinner v-else white/>
              </transition>
            </div>
          </div>

        </form> 
</template>

<script setup>
import phoneCodes from '~/api/phoneCodes.json'
import getCountryCode from "~/api/getCountryCode";
import {generateBody} from './generateBody'
import { onMounted } from 'vue';
const props = defineProps({
  isFirstFitting: {
    type: Boolean,
    required: false,
    default: false
  },
  altegioRequestData: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const { $validateEmail } = useNuxtApp();
const { locale, t } = useI18n()

const emits = defineEmits(['goStep', 'addAltegError'])
const sendingRequest = ref(false)

const userData = ref({
  firstName: {value: "", error: false, required: true},
  lastName: {value: "", error: false, required: true},
  email: {value: "", error: false, required: true},
  phone: {value: "", error: false, required: true},
  weddingDate: {value: "", error: false, required: true},
  models: { value: '', error: false },
  preferredContact: {value: "", error: false, required: true},
  people: {value: 0, error: false},
  consent: {value: false, error: false, required: true},
  
  ...(props.isFirstFitting && {
    dressSize: { value: '', error: false, required: true },
    budget: { value: '', error: false, required: true },
    instagram: { value: '', error: false },
    findOut: {value: [], error: false, required: true},
  })
})

const sizeItems = [
  {name: 'xs', value: 'XS-S', title: t('xs')},
  {name: 'ml', value: 'M-L', title: t('ml')},
  {name: 'xl', value: 'XL i więcej', title: t('xl')},
]

const budgetItems = [
{name: '6000 - 10 000', value: '6000 - 10 000', title: '6000 - 10 000'},
{name: '10 000 - 14 000', value: '10 000 - 14 000', title: '10 000 - 14 000'},
{name: '14 000 - 18 000', value: '14 000 - 18 000', title: '14 000 - 18 000'},
{name: '18 000 - 22 000', value: '18 000 - 22 000', title: '18 000 - 22 000'},
{name: '22 000+', value: '22 000+', title: '22 000+'},
]

const contactItems = [
{name: 'telefon', value: 'telefon', title: t('book_phone_call')},
{name: 'email', value: 'email', title: t('book_email')},
{name: 'sms', value: 'sms', title: t('text_message')},
]

const findOutItems = [
{name: 'Instagram', value: 'Instagram', title: 'Instagram'},
{name: 'Tik Tok', value: 'Tik Tok', title: 'Tik Tok'},
{name: 'Pinterest', value: 'Pinterest', title: 'Pinterest'},
{name: 'Google', value: 'Google', title: 'Google'},
{name: 'Reklamy', value: 'Reklamy', title: t("advertising")},
{name: 'Poczta pantoflowa', value: 'Poczta pantoflowa', title: t("word_of_mouth")},
]

const updatefindOutValue = (value) => {
  if (userData.value.findOut.value.includes(value)) {
    userData.value.findOut.value = userData.value.findOut.value.filter(item => item !== value)
  } else {
    userData.value.findOut.value.push(value)
  }
}

function validatePhone(phone) {
  const regex = /^\+?([0-9]{10,14})$/;
  return regex.test(phone);
}

function validateMinDate(date) {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate >= today;
}

watch(() => userData.value.phone.value, (phone) => {
  if (phone?.length === 0) {
    phone = '+'
  }
  if (phone[0] !== '+') {
    phone = `+${phone.slice(1)}`
  }

  phone = phone.replace(/[^+0-9]/g, "")
  userData.value.phone.value = phone
})

function setCountryCode(countryCode) {
  const index = phoneCodes.findIndex(l => l.code === countryCode)
  if (index && index !== -1) {
    userData.value.phone.value = phoneCodes[index].dial_code
  }
}

onMounted(async () => {
  const countryCode = await getCountryCode()
  setCountryCode(countryCode === 'null' ? 'PL' : countryCode)
})

  async function postRecord() {
  const fields = Object.keys(userData.value)
  const errors = []
  fields?.forEach(field => {
    if (userData.value[field].required) {
      if (field === 'consent') {
        if(userData.value[field].value === false) {
          userData.value[field].error = true
          errors.push(field)
        } else {userData.value[field].error = false}
      } else {
        if (!userData.value[field].value) {
          userData.value[field].error = true 
          errors.push(field)
        } else {userData.value[field].error = false}
      }
    }
  })

  if (!$validateEmail(userData.value.email.value)) {
    userData.value.email.error = true
    errors.push('email')
  }

  if (!validatePhone(userData.value.phone.value)) {
    userData.value.phone.error = true
    errors.push('phone')
  }

  if(!validateMinDate(userData.value.weddingDate.value)) {
    userData.value.weddingDate.error = true
    errors.push('weddingDate')
  }

  if (errors?.length > 0) {
    const yOffset = -40;
    const element = document.getElementById(errors[0]);
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});

    return
  }

  const body = generateBody({
    userData: userData.value, 
    isFirstFitting: props.isFirstFitting, 
    language: locale.value, 
    appointmentDate: props.altegioRequestData.date.slice(0, 10)
  })

  sendingRequest.value = true
  const googleSheetRequest = $fetch( '/api/googlesheets',  {method: "POST", body})
  const altegioRequest = $fetch('/api/alteg', {
    method: 'POST',
    body: {
      ...props.altegioRequestData,
      phone: userData.value.phone.value,
      email: userData.value.email.value,
      fullName: `${userData.value.firstName.value} ${userData.value.lastName.value}`,
      comment: `Number of people joining with ${userData.value.firstName.value}: ${userData.value.people.value}. Wedding Date: ${userData.value.weddingDate.value}. ${userData.value.findOut?.value?.length > 0 ? `Find out: ${userData.value.findOut.value.join(', ')}` : ""}`
    }
  })
  Promise.all([googleSheetRequest])
  .then(([googleData, altegioData]) => {
    if (altegioData.success) {
      emits('goStep', 3)
    }

    throw new Error(altegioData.meta.message)
    })
    .catch(e => emits('addAltegError', e.message))
    .finally(() => sendingRequest.value = false)
}
</script>

<style lang="scss" scoped>
.subtitle {
    font-style: italic;
    margin: 8px 0;
}

.submit-button {
  width: 100%;
  max-width: 350px;
}
</style>