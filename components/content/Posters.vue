<template>
  <div v-for="poster in data" class="col-6 col-12-md">
    <CollectionItem
        :title="poster.title"
        :text="poster.text"
        :image="poster.cover_3x4"
        :button_text="poster.button_text"
        :to="poster.button_link"
        poster
        :image_4x3="poster.cover_4x3"
        :button="poster.button"
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
