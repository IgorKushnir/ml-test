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
