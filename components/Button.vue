<template>
  <div class="button-container">
    <NuxtLink
        :to="path"
        :class="(type === 'primary' ? 'button primary' : 'button') + (target ? ' target' : '') + (fullWidth ? ' block' : '')"
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
  },
  fullWidth: {
    type: Boolean,
    required: false
  },
})


</script>

<style scoped lang="scss">


.button-container {
  cursor: pointer;
}
.block {
  display: block;
}

</style>
