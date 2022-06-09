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
.button-container {
  display: block;
  cursor: pointer;
}
.button {
  text-transform: uppercase;
  line-height: 16px;
  font-size: 16px;
  letter-spacing: .1em;

  display: inline-block;
  padding: 15px 31px;

  border: 1px solid $dark-blue;

  &.primary {
    background-color: $dark-blue;
    color: $white;
  }
}

@include md {
  .button {
    font-size: 14px;
  }
}

</style>
