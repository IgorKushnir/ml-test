<template>
  <div>
    <NuxtLink :to="to">
      <div class="bar-icon">
        <slot/>
      </div>
    </NuxtLink>

  </div>

</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: false,
    default: false
  }
})

</script>

<style scoped lang="scss">
.bar-icon {
  display: flex;
  align-items: center;
  margin-top: -1px;
  height: 63px;
  min-width: 64px;
  padding: 0 32px;
  border-width: 0px 1px;
  border-style: solid;
  border-color: $border-dark;
  margin: 0 -0.5px;
  cursor: pointer;
}
</style>
