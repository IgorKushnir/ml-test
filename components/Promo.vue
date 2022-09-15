<template>
  <div class="promo-container gap-S row justify-center p-v-56 p-v-32-md p-h-32-md" :class="'light_bg dark_blue'">
    <div class="col-3 col-12-md flex-center">
      <div class="logo"><Logo/></div>
    </div>
    <div class="col-5 col-12-md center-md">
      <div class="subheader" v-if="subheader">{{ subheader }}</div>
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="col-4 col-12-md flex-center">
      <NuxtLink class="button primary" v-if="button" :to="button_link">{{ button_text }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>

import Logo from "./Logo";

defineProps({
  subheader: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  button: {
    type: Boolean,
    required: true
  },
  button_text: {
    type: String,
    required: false
  },
  button_link: {
    type: String,
    required: false
  },
})
</script>

<style scoped lang="scss">
.promo-container {
  margin: 0!important;
  width: 100%!important;
}
.logo {
  height: 80px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
