<template>
  <div class="body" id="body">
<!--    <ZoomImage/>-->
    <div>
    <!--    <Header/> -->
      <NuxtPage />
    </div>
    <!--   <LazyFooter/> -->
  </div>
</template>


<script setup>
// ****  Nuxt SSR Optimizing Tips ****
// https://vueschool.io/articles/vuejs-tutorials/nuxt-ssr-optimizing-tips/
// ****

import {useIsMobile} from "~/composables/states";

const nuxtApp = useNuxtApp()
const likeCounter = useFavCount()
const {$getLikedProducts} = nuxtApp

const { locale } = useI18n()
watch(locale, () => {
  //Like list counter
  likeCounter.value = $getLikedProducts()?.length
})

import getAllFilters from '~/api/getAllFilters'
import getInitialData from '~/api/getInitialData';

import {useFiltersData, useTypesData, useMenuData, useTranslationsData} from "~/composables/states";

// get Initial data (Menu, Lines, Types)
// let {data: initialData, error: initialError} = await getInitialData(locale.value);
// if (!initialError.value) {
//   useMenuData().value = [initialData.value?.menu, initialData.value?.lines]
//   useTypesData().value = initialData.value?.types;
//   useTranslationsData().value = initialData.value?.translations;
// }
// Get all filters
// let {data, error} = await getAllFilters(locale.value);
// let allFilters = useFiltersData();
// if (!error.value) allFilters.value = data.value;

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

    // {name: 'facebook-domain-verification', content: 'wtdd4fzvg43jhi2tx4lpd4xumrtjln'}, // temporary to verify domain.
  ],
  link: [
    {rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico'},
    {rel: "shortcut icon", type: "image/x-icon", href: '/img/32.png'},
    {rel: "apple-touch-icon", type: "image/x-icon", href: '/img/256.png'},
  ],

  script: [
    {
      innerHTML: process.env.FACEBOOK_INIT ? `!function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', ${process.env.FACEBOOK_INIT});
                  fbq('track', 'PageView');
                  ` : ''
    },
    { // Pinterest Tag // posthog.capture('my event', { property: 'value' })
      innerHTML: process.env.PINTEREST_ID ? `!function(e){if(!window.pintrk){window.pintrk = function () {
                  window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                    n=window.pintrk;n.queue=[],n.version="3.0";var
                    t=document.createElement("script");t.async=!0,t.src=e;var
                    r=document.getElementsByTagName("script")[0];
                    r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                  pintrk('load', ${process.env.PINTEREST_ID}, {em: '<user_email_address>'});
                  pintrk('page');
                  ` : ''
    },
    {innerHTML: process.env.HOTJAR_ID ? `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');` : ''},
    {async: true, src: process.env.COOKIEYES_CODE ? `//cdn.cookie-script.com/s/${process.env.COOKIEYES_CODE}.js` : ''},
    // { async: true, src: "https://www.googletagmanager.com/gtag/js?id=AW-16455473849"},
    // {
    //   innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-16455473849');`
    // },
  ],
  noscript: [
    {
      innerHTML: process.env.FACEBOOK_ID ? `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${process.env.FACEBOOK_ID}&ev=PageView&noscript=1" />` : ''
      // tagPosition: 'bodyOpen'
    },
    { // Pinterest Tag
      innerHTML: process.env.PINTEREST_ID ? `<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=${process.env.PINTEREST_ID}&pd[em]=<hashed_email_address>&noscript=1" />` : ''
    },
  ],
})

onMounted(async () => {
  // gtag('config', 'AW-16455473849'); // Google Ads - Addon to Gtag

  reportWindowSize()
  window.addEventListener('resize', reportWindowSize, {passive: true});

  loadNextHook()

  //Like list counter
  likeCounter.value = $getLikedProducts()?.length
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
