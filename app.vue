<template>
  <div class="body" id="body">
    <ZoomImage/>
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


import {useIsMobile} from "~/composables/states";


const nuxtApp = useNuxtApp()
const likeCounter = useFavCount()
const {$getLikedProducts} = nuxtApp

const { locale } = useI18n()
watch(locale, () => {
  //Like list counter
  likeCounter.value = $getLikedProducts().length
})



import getAllFilters from '~/api/getAllFilters'
import getInitialData from '~/api/getInitialData';

import {useFiltersData, useTypesData, useMenuData, useTranslationsData} from "~/composables/states";

// get Initial data (Menu, Lines, Types)
let {data: initialData, error: initialError} = await getInitialData(locale.value);
if (!initialError.value) {
  useMenuData().value = [initialData.value.menu, initialData.value.lines]
  useTypesData().value = initialData.value.types;
  useTranslationsData().value = initialData.value.translations;

}
// Get all filters
let {data, error} = await getAllFilters(locale.value);
let allFilters = useFiltersData();
if (!error.value) allFilters.value = data.value;






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
      innerHTML: `!function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '406315495262476');
                  fbq('track', 'PageView');
                  `
    },
    { // Pinterest Tag // posthog.capture('my event', { property: 'value' })
      innerHTML: `!function(e){if(!window.pintrk){window.pintrk = function () {
                  window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                    n=window.pintrk;n.queue=[],n.version="3.0";var
                    t=document.createElement("script");t.async=!0,t.src=e;var
                    r=document.getElementsByTagName("script")[0];
                    r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                  pintrk('load', '2613056388970', {em: '<user_email_address>'});
                  pintrk('page');
                  `
    },
    { // posthog
      innerHTML: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_TLmemHD0HjTshufikjRicBXIIbPQqCz6lqPR7VRvvHL',{api_host:'https://us.i.posthog.com', person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
        })`
    }
    // { async: true, src: "https://www.googletagmanager.com/gtag/js?id=AW-16455473849"},
    // {
    //   innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-16455473849');`
    // },
  ],
  noscript: [
    {
      innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1040268723752792&ev=PageView&noscript=1" />`
      // tagPosition: 'bodyOpen'
    },
    { // Pinterest Tag
      innerHTML: `<img height="1" width="1" style="display:none;" alt="" src="https://ct.pinterest.com/v3/?event=init&tid=2613056388970&pd[em]=<hashed_email_address>&noscript=1" />`
    },
  ],
})






onMounted(async () => {
  gtag('config', 'AW-16455473849'); // Google Ads - Addon to Gtag

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
