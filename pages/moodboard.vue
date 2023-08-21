<template>
  <div>
    <Seo title="Mood board" :breadcrumbs="[
        {
          title: 'Mood board',
        }
    ]" blockRobots/>
    <InnerHeader title="Mood board"/>


    <transition name="fade">
      <div v-if="!pending && !firstLoading">
        <ProductGrid
            :products-data="{data: data?.liked}"
            :pending-products="!data?.liked"
            :grid="4"
            moodboard
        />


        <Carusel v-if="data?.viewed.length > 0" :data="data?.viewed" class="m-v-80">
          <h2 class="m-t-0 m-b-40 m-b-24-md">You recently viewed</h2>
        </Carusel>
      </div>
    </transition>

    <Loading :pending="pending || firstLoading"/>


  </div>
</template>

<script setup>
import productsResponse from '~/api/getProductsById'
import SnackBar from "../components/SnackBar";
import Container from "../components/Container";

const {$getViewedProduct, $getLikedProducts, $toggleLikeProduct} = useNuxtApp()

const viewedProductIds = ref([]);
const likedProductIds = ref([]);
const products = computed(() => {
  const arr = [...viewedProductIds.value, ...likedProductIds.value];
  return arr.filter(function (item, pos) {
    return arr.indexOf(item) === pos;
  })
})
const firstLoading = ref(true)

// if (process.browser) {
//   // console.log('client');
// }
let {data, pending, refresh, error} = useLazyAsyncData('moodboard', () => productsResponse({
  products: products.value,
  lang: "en"
}), {
  transform: (d) => {
    const _products = d.data.products.data;
    let viewed = _products.filter(product => viewedProductIds.value.includes(product.id))
    let liked = _products.filter(product => likedProductIds.value.includes(product.id))

    viewed.sort((a, b) => viewedProductIds.value.indexOf(a.id) - viewedProductIds.value.indexOf(b.id));
    liked.sort((a, b) => likedProductIds.value.indexOf(a.id) - likedProductIds.value.indexOf(b.id));

    return {viewed, liked}
  },
})


onMounted(() => {
  viewedProductIds.value = $getViewedProduct()
  likedProductIds.value = $getLikedProducts()

  // // Check unexisting products and remove from the like list
  // if (data.value?.liked?.length > 0) {
  //   likedProductIds.value.forEach(likedProductId => {
  //     const index = data.value.liked.findIndex(p => p.id === likedProductId)
  //     if (index === -1) {
  //       $toggleLikeProduct(likedProductId)
  //     }
  //   })
  // }


  getInitialData()

})

function getInitialData() {
  if (!pending.value) {
    refreshNuxtData('moodboard')
    firstLoading.value = false;
  } else {
    setTimeout(getInitialData, 100)
  }
}


</script>

<style scoped>


</style>
