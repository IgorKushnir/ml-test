<template>
  <div class="container  m-v-80 m-v-40-xl m-v-32-md">
    <div :class="`row gap-${size} ${justify}`">
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  justify: {
    type: String,
    required: false,
    default: 'justify-flex-start'
  },
  size: {
    type: String,
    required: false,
    default: 'S'
  }
})

</script>

<style scoped>

</style>
