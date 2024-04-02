<template>

  <transition v-if="show" name="fade">
    <State
        title="Page not found"
        text="Looks like you just missed the party! The page you are looking for was moved, removed, renamed or no longer exists."
        :button="{text: 'Home page', path: localePath('/')}"
        image-path="/img/decline.svg"
    />
  </transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})
const event = useRequestEvent()
if (process.server && props.show) {
  const nuxtApp = useNuxtApp()
  const error = new Error()
  error.statusCode = 404
  nuxtApp.ssrContext.error = error

  // console.log('------', event);
  if (event) {
    setResponseStatus(event, 404, 'Page Not Found')
  }
  // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })


  // if (nuxtApp.ssrContext) {
  //   nuxtApp.ssrContext.nuxt.error = createError({ statusCode: 404 });
  // }

}
// if (props.show) {
//   // if (nuxtApp.ssrContext) {
//   //   console.log(nuxtApp.ssrContext.nuxt);
//   //   // nuxtApp.ssrContext.nuxt.error = createError({ statusCode: 404 });
//   // }
// }

</script>

<style scoped>

</style>
