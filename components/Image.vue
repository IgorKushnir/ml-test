<template>
  <div class="img-component-container">
    <img v-if="path.data?.attributes?.placeholder != null" :src="path.data.attributes.placeholder" :alt="alt" class="img-component placeholder">
    <img v-if="!onlyPlaceholder" :src="$getImage(path, size)"  :alt="alt" class="img-component"  loading="lazy">
  </div>
</template>

<script setup>
const {$getImage} = useNuxtApp()

let props = defineProps({
  path: {
    type: Object,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: false,
    default: 'medium'
  },
  onlyPlaceholder: {
    type: Boolean,
    required: false,
    default: false
  }

})



</script>

<style lang="scss">
.img-component-container {
  overflow: hidden;
}
.img-component {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-component.placeholder {
  filter: blur(40px);
  transform: scale(1.5);
}

</style>
