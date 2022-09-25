<template>
  <div class="body" id="body">
    <div>
      <Header/>
      <State
          :title="error.statusCode == 404 ? 'Page not found' : error.message"
          :text="error.statusCode == 404 ? 'Looks like you just missed the party! The page you are looking for was moved, removed, renamed or no longer exists.' : error.description"
          :button="{
            text: 'Home page',
            path: '/'
          }"
          image-path="/img/decline.svg"
      />
    </div>
    <Footer/>
  </div>
</template>


<script setup>
import State from "./components/State";

const props = defineProps({
  error: Object
})

import getInitialData from '~/api/getInitialData';
import getAllFilters from '~/api/getAllFilters'

import {useFiltersData, useMenuData, useTypesData, usePreviousRoute, useIsMobile, useTranslationsData} from "~/composables/states";

const nuxtApp = useNuxtApp()
const likeCounter = useFavCount()
const { $getLikedProducts } = useNuxtApp()

// get Initial data (Menu, Lines, Types)
let {data: initialData, error: initialError} = await getInitialData('en');
if (!initialError.value) {
  useMenuData().value = [initialData.value[0], initialData.value[1]]
  useTypesData().value = initialData.value[2];
  useTranslationsData().value = initialData.value[3];
}
const translations = useTranslationsData();


// Get all filters
let allFilters = useFiltersData();
let {data, pending, refresh, error: dError} = await getAllFilters('en');
if (!dError.value) allFilters.value = data.value;



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




onMounted(async () => {
  reportWindowSize()
  window.addEventListener('resize', reportWindowSize, {passive: true});
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
}


</script>

<style lang="scss">
.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


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


<!--<style lang="scss">-->
<!--@import  "/assets/style/global.scss";-->




<!--</style>-->
