<template>
  <div>
<!--    <div class="col-10">-->
<!--      <div class="new-ratio-16x9">-->
<!--        <Fact :data="{-->
<!--          title: 'Meet Bella Belle x Milla Nova charity collaboration',-->
<!--          text: 'A-line ivory gown on straps with sequin embroidery and open back. The gown has a sheer cape made of tulle also embroidered with sequins.',-->
<!--          background_color: 'dark_blue',-->
<!--          text_color: 'light',-->
<!--          layout: 'tight',-->
<!--          logo: true-->
<!--        }"/>-->
<!--      </div>-->
<!--    </div>-->

    <Header/>
    <NuxtPage/>
    <Footer/>
  </div>
</template>

<script setup>
import getInitialData from '~/api/getInitialData';
// import fav32 from '/public/img/32.png';
// import fav256 from '/public/img/256.png';
import getAllFilters from '~/api/getAllFilters'

import {useFiltersData, useMenuData, useTypesData, usePreviousRoute, useIsMobile, useTranslationsData} from "~/composables/states";

const nuxtApp = useNuxtApp()


// get Initial data (Menu, Lines, Types)
let {data: initialData, error: initialError} = await getInitialData('en');
if (!initialError.value) {
  useMenuData().value = [initialData.value[0], initialData.value[1]]
  useTypesData().value = initialData.value[2];
  useTranslationsData().value = initialData.value[3];

}


// Get all filters
let allFilters = useFiltersData();
let {data, pending, refresh, error} = await getAllFilters('en');
if (!error.value) allFilters.value = data.value;

// Get types



useHead({
  // titleTemplate: 'My App - %s',
  // or, instead:
  title: 'Some Page',

  titleTemplate: (title) => `${title} - Milla Nova | Wedding dresses | Collection Olives, Greece, Love`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  link: [
    {
      href: '/img/32.png', rel: "shortcut icon", type:"image/x-icon",
    },
    {
      href: '/img/256.png', rel: "apple-touch-icon",
    }
  ],
  // script: [
  //   {
  //     src: '/js/shortcode/shortcode.js'
  //   }
  // ]
  // import Shortcode from '~/assets/js/shortcode/shortcode'


  // meta: [
  //   {  name: 'description', content: 'My amazing site.' }
  // ],
  // bodyAttrs: {
  //   class: 'test'
  // }
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
  window.addEventListener('resize', reportWindowSize);

  loadNextHook()
});

// Check size
function reportWindowSize() {
  const mobile = window.document.body.offsetWidth < 769;
  if (useIsMobile().value !== mobile) {
    useIsMobile().value = mobile;
  }
}





nuxtApp.hook("page:finish", () => {
  setTimeout(go, 500)

  function go() {
    // Is next and prev route Product page
    if ((useRoute().name === usePreviousRoute().value) && (usePreviousRoute().value === 'product-slug') && !useIsMobile().value) {
      window.scrollTo({
        top: 153,
        // behavior: "smooth"
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }

})





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

  });
}

</script>

<style lang="scss">


.page-enter-active,
.page-leave-active {
  //transform-origin: top;
  transition: all 0.5s ease;
}

.page-enter-from {
  opacity: 0;
}
.page-leave-to {
  opacity: 0;
  //transform: scale(0.9);
}


@include md {
  .page {
    padding-top: 56px;
  }
}
</style>

