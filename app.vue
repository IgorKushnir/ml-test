<template>
  <div>
    <Header/>

    <NuxtPage class="page"/>

  </div>
</template>



<script setup lang="ts">
// Load menu data
import menuData from '~/api/getMenuData';

useMenuData().value = await menuData();

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
