<template>
  <div>
    <Header/>

    <NuxtPage class="page"/>

  </div>
</template>



<script setup lang="ts">
import menuData from '~/api/getMenu';

useMenuData().value = await menuData('en')




// // computed
// const count = computed(()=> 3)

onMounted(() => {
  reportWindowSize()
  window.addEventListener('resize', reportWindowSize);
});

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

