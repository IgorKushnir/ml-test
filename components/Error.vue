<template>
  <div ref="error">
    <transition name="fade" mode="in-out">
      <div v-if="text && text !== ''" class="row justify-center" >
        <div class="col-12 vanilla_ice_bg">
          <div class="center m-v-24 m-v-16-md p-h-16"><div>{{ text }}</div></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String
  }
})
const error = ref()

watch(() => props.text, async () => {
  if (props.text && props.text !== '') {

    const yOffset = 0;
    const element = error.value;
    if (!element) return
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
})

</script>

<style scoped>

</style>
