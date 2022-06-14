<template>
  <div>
    <transition name="fade">
      <State class="loading" />
    </transition>
  </div>
</template>

<script setup>
defineProps({
  pending: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
.loading {
  opacity: .8;
  animation: blinker 1s ease-in-out infinite;

}


@keyframes blinker {
  50% {
    opacity: .3;
  }
}

</style>
