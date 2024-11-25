<template>
  <div :class="`container  m-v-${marginVertical} m-v-40-xl m-v-32-md`">
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
  },
  marginVertical: {
    type: String,
    required: false,
    default: '80'
  }
})

</script>

<style scoped>

</style>
