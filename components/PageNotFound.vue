<template>
  <transition v-if="show" name="fade">
    <State
        title="Page not found"
        text="Looks like you just missed the party! The page you are looking for was moved, removed, renamed or no longer exists."
        :button="{text: 'Home page', path: '/'}"
    />
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>

</style>
