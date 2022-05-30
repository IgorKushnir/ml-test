<template>
  <div>
    <Header/>

    <NuxtPage class="page"/>

  </div>
</template>



<script setup lang="ts">
import menuData from '~/api/getMenu';
import fav32 from '~/assets/img/32.png';
import fav256 from '~/assets/img/256.png';


useMenuData().value = await menuData('en')

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
      href: fav32, rel: "apple-touch-icon",
    }
  ]
  // meta: [
  //   {  name: 'description', content: 'My amazing site.' }
  // ],
  // bodyAttrs: {
  //   class: 'test'
  // }
})



// // computed
// const count = computed(()=> 3)


onMounted(() => {
  reportWindowSize()
  window.addEventListener('resize', reportWindowSize);
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
@include md {
  .page {
    padding-top: 56px;
  }
}
</style>

