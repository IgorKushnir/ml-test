<template>
  <div class="ratio-16x9" v-if="data && url">
    <iframe width="100%" height="100%" frameborder="0" allowfullscreen loading="lazy" :src="url"></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const url = computed(() => props.data.type === 'youtube' ? '//www.youtube.com/embed/' + props.data.id : props.data.type === 'vimeo' ? 'https://player.vimeo.com/video/' + props.data.id : null)

</script>

<style scoped>

</style>
