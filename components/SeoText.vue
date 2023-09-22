<template>
  <Container justify="justify-center" v-if="html">
    <div class="col-8 col-12-md">
      <div class="gray" v-html="html"/>
    </div>
  </Container>
</template>

<script setup>
const props = defineProps({
  html: {
    type: String,
    required: false
  }
})
</script>

<style scoped>

</style>
