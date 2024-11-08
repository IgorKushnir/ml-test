<template>
    <form v-if="userData" @submit.prevent="postRecord" class="col-8 col-12-md form">
          <div class="input-block c-2" :class="userData.firstName.error ? 'error' : ''">
            <label class="p-small required" for="firstName">{{ $t('book_first_name') }}</label>
            <input
                autofocus
                required
                v-model="userData.firstName.value"
                class="input m-t-8"
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
                class="input m-t-8"
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
                class="input m-t-8"
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
                class="input m-t-8"
                type="tel"
                name="phone"
                id="phone"
            />

            <label for="phone" class="error-message">{{ $t('book_error_phone') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.weddingDate.error ? 'error' : ''">
            <label class="p-small required" for="weddingDate">{{ $t('book_celebrated_date') }}</label>
            <input
                v-model="userData.weddingDate.value"
                required
                class="input m-t-8"
                type="date"
                name="weddingDate"
                id="weddingDate"
            />
            <label for="weddingDate" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.fittingType.error ? 'error' : ''">
            <label class="p-small required" for="fittingType">{{ $t("fitting_type") }}</label>
            <select
                class="input m-t-8"
                name="fittingType"
                id="fittingType"
                v-model="userData.fittingType.value"
                required
            >
            <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="Pierwsza" selected>{{ $t('first_fitting') }}</option>
              <option value="Powtórna">{{ $t('retry_fitting') }}</option>
            </select>
            <label for="fittingType" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.dressSize.error ? 'error' : ''">
            <label class="p-small required" for="dressSize">{{ $t("dress_size") }}</label>
            <select
                class="input m-t-8"
                name="dressSize"
                id="dressSize"
                v-model="userData.dressSize.value"
                required
            >
            <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="XS-S" selected>{{ $t('xs') }}</option>
              <option value="M-L">{{ $t('ml') }}</option>
              <option value="XL i więcej">{{ $t('xl') }}</option>
            </select>
            <label for="dressSize" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.budget.error ? 'error' : ''">
            <label class="p-small required" for="budget">{{ $t("budget") }}</label>
            <select
                class="input m-t-8"
                name="budget"
                id="budget"
                v-model="userData.budget.value"
                required
            >
            <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="4000 - 12 000" selected>4000 - 12 000</option>
              <option value="12 000 - 28 000">12 000 - 28 000</option>
              <option value="28 000+">28 000+</option>
            </select>
            <label for="budget" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.models.error ? 'error' : ''">
            <label class="p-small" for="email">{{ $t('dress_list') }}</label>
            <input
                v-model="userData.models.value"
                class="input m-t-8"
                type="text"
                name="models"
                id="models"
            />
            <label for="models" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2" :class="userData.instagram.error ? 'error' : ''">
            <label class="p-small" for="email">{{ $t('instagram') }}</label>
            <input
                v-model="userData.instagram.value"
                class="input m-t-8"
                type="text"
                name="instagram"
                id="instagram"
            />
            <label for="instagram" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2">
            <label class="p-small" for="findOut">{{ $t("book_find_out") }}</label>
            <select
                class="input m-t-8"
                name="findOut"
                id="findOut"
                v-model="userData.findOut.value"
            >
              <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="Instagram">Instagram</option>
              <option value="Tik Tok">Tik Tok</option>
              <option value="Pinterest">Pinterest</option>
              <option value="Google">Google</option>
              <option value="Reklama">{{ $t("advertising") }}</option>
              <option value="Pokazy">{{ $t("trunk_shows") }}</option>
              <label for="findOut" class="error-message">{{ $t('book_error_empty_field') }}</label>
              <option value="Z polecenia">{{ $t("word_of_mouth") }}</option>
            </select>
          </div>

          <div class="input-block c-2" :class="userData.preferredContact.error ? 'error' : ''">
            <label class="p-small required" for="preferredContact">{{ $t("preferred_contact") }}</label>
            <select
                class="input m-t-8"
                name="preferredContact"
                id="preferredContact"
                v-model="userData.preferredContact.value"
                required
            >
              <option :value="null" selected>- {{$t('choose_an_option')}} -</option>
              <option value="email">{{ $t("book_email") }}</option>
              <option value="telefon">{{ $t("book_phone_call") }}</option>
              <option value="sms">SMS</option>
            </select>
            <label for="preferredContact" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2">
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
            <label for="people" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

          <div class="input-block c-2">
            <label class="p-small" for="people">{{ $t("book_urgent") }}</label>
            <select
                class="input m-t-8"
                name="urgent"
                id="urgent"
                v-model="userData.urgent.value"
            >
              <option value="nie" selected>{{ $t("no") }}</option>
              <option value="tak">{{ $t("yes") }}</option>
            </select>
            <label for="people" class="error-message">{{ $t('book_error_empty_field') }}</label>
          </div>

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
            <div class="button primary" :class="sendingRequest ? 'loading' : ''" v-on:click="postRecord">
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
const { $validateEmail } = useNuxtApp();
const { t, locale } = useI18n()

const props = defineProps({
  selectedServiceId: Number
})
const emits = defineEmits(['goStep'])
const sendingRequest = ref(false)

const userData = ref({
  firstName: {value: "", error: false, required: true},
  lastName: {value: "", error: false, required: true},
  email: {value: "", error: false, required: true},
  phone: {value: "", error: false, required: true},
  weddingDate: {value: "", error: false, required: true},
  fittingType: { value: '', error: false, required: true},
  dressSize: { value: '', error: false, required: true },
  budget: { value: '', error: false, required: true },
  models: { value: '', error: false },
  instagram: { value: '', error: false },
  preferredContact: {value: "", error: false, required: true},
  people: {value: 0, error: false},
  findOut: {value: null, error: false},
  urgent: {value: 'nie', error: false},
  consent: {value: false, error: false, required: true},
})

function validatePhone(phone) {
  const regex = /^\+?([0-9]{10,14})$/;
  return regex.test(phone);
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

import getCountryCode from "../../api/getCountryCode";
import {generateBody} from './generateBody'
import { onMounted } from 'vue';

onMounted(async () => {
  let countryCode = await getCountryCode()
  setCountryCode(countryCode === 'null' ? 'US' : countryCode)
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
  const emailValidationResult = $validateEmail(userData.value.email.value)
  if (!emailValidationResult) {
    userData.value.email.error = true
    errors.push('email')
  }

  const phoneValidationResult = validatePhone(userData.value.phone.value)
  if (!phoneValidationResult) {
    userData.value.phone.error = true
    errors.push('phone')
  }

  if (errors?.length > 0) {
    const yOffset = -40;
    const element = document.getElementById(errors[0]);
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});

    return
  }

  const body = generateBody(userData.value, props.selectedServiceId === 0 ? 'Suknie ślubne' : 'Suknie wieczorowe', locale.value)

  sendingRequest.value = true
  try {
    await $fetch( '/api/googlesheets',  {method: "POST", body})
    emits('goStep', 2)
  } catch (e) {
    console.error(e);
  }

  sendingRequest.value = false
}
</script>