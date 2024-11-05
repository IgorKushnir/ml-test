<template>
  <NuxtImg :src="'/img/flags/'+ code?.toLowerCase() +'.webp'" class="flag" loading="lazy" format="webp" />

</template>

<script setup>
defineProps({
  code: {
    type: String,
    required: false
  }
})



</script>

<style scoped>
.flag {
  width: 24px;
  /*height: 16px;*/
  /*background-color: #eb5757;*/
}

</style>
