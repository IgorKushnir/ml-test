<template>
  <div class="body" id="body">
    <div>
      <Header/>

      <NuxtPage/>


    </div>
    <Footer/>
  </div>
</template>


<script setup>
// ****  Nuxt SSR Optimizing Tips ****
// https://vueschool.io/articles/vuejs-tutorials/nuxt-ssr-optimizing-tips/
// ****

// const router = useRouter()
// console.log(router.options.routes);

import {useIsMobile} from "~/composables/states";

const nuxtApp = useNuxtApp()
const likeCounter = useFavCount()
const {$getLikedProducts} = nuxtApp

const { locale } = useI18n()
watch(locale, () => {
  //Like list counter
  likeCounter.value = $getLikedProducts().length
})

useHead({
  title: 'Milla Nova',

  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',

  meta: [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    {name: 'publisher', content: 'Milla Nova'},
    {name: 'author', content: 'Milla Nova'},
    {name: 'copyright', content: 'Milla Nova'},
    {name: 'revisit-after', content: '2 days'},
  ],
  link: [
    {rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico'},
    {rel: "shortcut icon", type: "image/x-icon", href: '/img/32.png'},
    {rel: "apple-touch-icon", type: "image/x-icon", href: '/img/256.png'},
  ]
})






onMounted(async () => {
  reportWindowSize()
  window.addEventListener('resize', reportWindowSize, {passive: true});

  loadNextHook()


  //Like list counter
  likeCounter.value = $getLikedProducts().length
});

// Check size
function reportWindowSize() {
  nuxtApp.callHook('page:resize')
  const mobile = window.document.body.offsetWidth < 769;
  if (useIsMobile().value !== mobile) {
    useIsMobile().value = mobile;
  }

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}




function loadNextHook() {
  let currentPageHeight = ref(0);
  let allowLoadNext = true;
  watch(currentPageHeight, () => {
    allowLoadNext = true;
  })

  document.addEventListener('scroll', function (e) {
    currentPageHeight.value = document.body.scrollHeight;
    const Y = window.scrollY - (document.body.scrollHeight - window.innerHeight);
    if (-Y < window.innerHeight) {
      if (allowLoadNext) {
        nuxtApp.callHook('page:loadNext')
        allowLoadNext = false;
      }
    }

  }, {passive: true});
}

</script>

<style lang="scss">
.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


@include md {
  .page {
    padding-top: 56px;
  }
}
</style>


<!--<style lang="scss">-->
<!--@import  "/assets/style/global.scss";-->


<!--</style>-->
