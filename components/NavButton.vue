<template>
  <NuxtLink :to="to" class="nav-button">
    <span class="nav-link">{{ title }}</span>
    <span class="icon-arrow-16"/>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
})

</script>

<style scoped lang="scss">


.nav-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 24px;
  gap: 8px;
  height: 48px;
  border: 1px solid $border-dark;
  margin: 16px 0;
  min-width: 100%;
  justify-content: space-between;
}

</style>
