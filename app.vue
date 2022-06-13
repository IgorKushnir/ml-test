<template>
  <div>
    <Header/>

    <NuxtPage/>

  </div>
</template>



<script setup lang="ts">
import menuData from '~/api/getMenu';
import fav32 from '~/assets/img/32.png';
import fav256 from '~/assets/img/256.png';
import getAllFilters from '~/api/getAllFilters'

// get menu data
useMenuData().value = await menuData('en')

// Get all filters
let allFilters = useFiltersData();
let {data, pending, refresh, error} = await getAllFilters('en');
if (!error.value) allFilters.value = data.value;



useHead({
  // titleTemplate: 'My App - %s',
  // or, instead:
  title: 'Some Page',

  titleTemplate: (title) => `${title} - Milla Nova | Wedding dresses | Collection Olives, Greece, Love`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  link: [
    {
      href: fav32, rel: "shortcut icon", type:"image/x-icon",
    },
    {
      href: fav256, rel: "apple-touch-icon",
    }
  ],

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
  // console.log(localStorage);
});

// Check size
function reportWindowSize() {
  const mobile = window.document.body.offsetWidth < 769;
  if (useIsMobile().value !== mobile) {
    useIsMobile().value = mobile;
  }
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

