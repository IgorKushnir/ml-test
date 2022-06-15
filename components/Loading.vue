<template>
  <div>
    <transition name="fade">
      <State v-if="pending" :class="'loading ' + extendedClass" />
    </transition>
  </div>
</template>

<script setup>
defineProps({
  pending: {
    type: Boolean,
    required: true
  },
  extendedClass: {
    type: String,
    required: false,
    default: ''
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
