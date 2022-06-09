<template>
<!--  <img :src="'.../assets/img/flags/ad.webp)'" class="flag"/>-->
  <img :src="'../assets/img/flags/' + code.toLowerCase() + '.webp'" class="flag"/>

</template>

<script setup>
defineProps({
  code: {
    type: String,
    required: true
  }
})


</script>

<style scoped>
.flag {
  width: 24px;
  /*height: 16px;*/
  background-color: #eb5757;
}

</style>
