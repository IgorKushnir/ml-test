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


import {useFiltersData, useMenuData, useTypesData, usePreviousRoute, useIsMobile, useTranslationsData} from "~/composables/states";
import router from "./plugins/router";

const nuxtApp = useNuxtApp()
const likeCounter = useFavCount()
const { $getLikedProducts } = useNuxtApp()

const { locale } = useI18n()


// const translations = useTranslationsData();




useHead({
  title: 'Milla Nova',

  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',

  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'publisher', content: 'Milla Nova' },
    { name: 'author', content: 'Milla Nova' },
    { name: 'copyright', content: 'Milla Nova' },
    { name: 'revisit-after', content: '2 days' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' },
    { rel: "shortcut icon",  type:"image/x-icon", href: '/img/32.png'},
    { rel: "apple-touch-icon",  type:"image/x-icon", href: '/img/256.png'},
  ]
})




// // computed
// const count = computed(()=> 3)


//// Have to be inside in routs
// onBeforeRouteLeave((to, from) => {
//   console.log('to');
// })
//
// onBeforeRouteUpdate((to, from) => {
//   console.log('to');
// })

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


// let _savedPosition = null;
// useRouter().options.scrollBehavior = (to, from, savedPosition) => {
//   console.log(savedPosition);
//   _savedPosition = savedPosition;
//   // return new Promise((resolve, reject) => {
//   //   setTimeout(() => {
//   //     resolve({ left: 0, top: savedPosition?.top ?? 0, behaviour: "smooth" });
//   //   }, 500);
//   // });
// };

// nuxtApp.hook("page:finish", () => {
//   setTimeout(go, 1000)
//
//
//   function go() {
//     // Is next and prev route Product page
//     if ((useRoute().name === usePreviousRoute().value) && (usePreviousRoute().value === 'product-slug') && !useIsMobile().value) {
//       window.scrollTo({
//         top: 153,
//         // behavior: "smooth"
//       })
//     } else {
//       window.scrollTo({
//         top:  0,
//         // behavior: "smooth"
//       })
//     }
//   }
//
// })






function loadNextHook() {
  let currentPageHeight = ref(0);
  let allowLoadNext = true;
  watch(currentPageHeight, () => {
    allowLoadNext = true;
  })

  document.addEventListener('scroll', function(e) {
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
