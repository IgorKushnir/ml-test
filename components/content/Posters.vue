<template>
  <div v-for="poster in data" class="col-6 col-12-md">
    <CollectionItem
        :title="poster.title"
        :text="poster.text"
        :image="poster.media"
        :button_text="poster.button_text"
        :to="poster.button_link"
        gradient
    />
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  }
})

</script>

<style scoped>

</style>
