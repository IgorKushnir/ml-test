<template>
  <NuxtLink :to="'/news/' + data.attributes.slug">
    <div class="ratio-1x1">
      <Image :path="data.attributes.cover_1x1"/>
    </div>
    <h3 class="m-t-24 m-b-8">{{data.attributes.title}}</h3>
    <p class="m-t-8 m-b-0">{{$getDate(data.attributes.created, $getMonths)}}</p>
  </NuxtLink>

</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})

</script>

<style scoped>

</style>
