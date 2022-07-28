<template>
  <div class="button-container">
    <NuxtLink
        :to="path"
        :class="(type === 'primary' ? 'button primary' : 'button') + (target ? ' target' : '')"
        :target="target ? target : '_self'">
      <slot/>
    </NuxtLink>
  </div>

</template>

<script setup>
defineProps({
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false
  },
  target: {
    type: Boolean,
    required: false
  }
})


</script>

<style scoped lang="scss">
@import  "/assets/style/global.scss";

.button-container {
  cursor: pointer;
}

</style>
