<template>
  <div v-for="poster in data" class="col-12-md" :class="poster.wide ? ' col-12' : ' col-6'">
    <CollectionItem
        :title="poster.title"
        :text="poster.text"
        :image="poster.cover_3x4"
        :button_text="poster.button_text"
        :to="poster.button_link"
        :poster="!poster.wide"
        :wide="poster.wide"
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
