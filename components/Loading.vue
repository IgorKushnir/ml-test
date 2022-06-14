<template>
  <div>
    <State class="loading" />
  </div>
</template>

<script>
export default {
  name: "Loading"
}
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
