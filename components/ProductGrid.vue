<template>
  <SnackBar ref="snackBar" @action="undoHandler"/>
  <transition name="fade">
    <Container v-if="productsData  && productsData?.data?.length > 0">
      <template  v-for="(product, index) in productsData.data">

        <slot name="promo" v-if="index === 0"/>
        <slot name="fact" v-if="promo ? (index === 8) : (index === 7)"/>

        <div :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-6-md col-12-sm'">
          <ProductItem :title="product.attributes.title" :to="'/' + product.attributes.type.data.attributes.slug + '/' + product.attributes.slug"
                       :image="product.attributes.cover_3x4"
                       :id="product.id"
                       :like-list="likeList"
                       @updateLikes="updateLikes"
                       :hideLikedDefault="moodboard"
                       :product-type="product?.attributes?.type?.data?.attributes?.slug"
          />
        </div>
      </template>
    </Container>
  </transition>



  <Loading :pending="pendingProducts"  extended-class="half"/>
  <transition name="fade">
    <div v-if="productsData && !pendingProducts && productsData.data.length === 0">
      <State v-if="!moodboard" title="No products"  class="half"></State>
      <State v-if="moodboard"
             title="Your Moodboard is empty"
             text="Discover products and add it to your list."
             :button="{text: 'Discover', path: '/dress'}"
             class="half"
             image-path="/img/moodboard-empty.svg"
      ></State>
    </div>
  </transition>


  <div v-if="infinite" ref="loader">
<!--    <div >-->
<!--    <div v-if="showLoader">-->
<!--    </div>-->
  </div>

</template>

<script setup>
import ProductItem from "./ProductItem";
const snackBar = ref(null);

const emits = defineEmits(['load'])
const props = defineProps({
  productsData: {
    type: Object,
    required: true
  },
  pendingProducts: {
    type: Boolean,
    required: true
  },
  grid: {
    type: Number,
    required: false,
    default: 3
  },
  promo: {
    type: Boolean,
    required: false,
    default: false
  },
  infinite: {
    type: Boolean,
    required: false,
    default: false
  },
  moodboard: {
    type: Boolean,
    required: false,
    default: false
  }
})
const { $getLikedProducts, $toggleLikeProduct } = useNuxtApp()

const loader = ref();
let showLoader = ref(false)
const likeList = ref([])
const lastRemovedProduct = ref([])

watch(() => props.productsData?.data, () => {
  showLoader.value = false
})

function needsToLoad() {
  return (props.productsData !== null) && (props.productsData.meta.pagination.pageCount > 0 ) && (props.productsData.meta.pagination.page < props.productsData.meta.pagination.pageCount )
}

function scroll() {
  if (loader.value !== null) {
    if (props.productsData !== null && !props.pendingProducts) {
      if (needsToLoad()) {
        const loaderY = loader.value.getBoundingClientRect().top - window.innerHeight;

        if (loaderY < 0) {
          if (!showLoader.value) {
            showLoader.value = true
            const nextPage = props.productsData.meta.pagination.page + 1;
            emits('load', nextPage)
            console.log('load next page: ', nextPage);
          }
        }
      }
    }
  }
}

// let i = 0;
// const mountCheck = setInterval(function () {
//   scroll();
//   if (needsToLoad()) {
//     console.log('stop');
//     clearInterval(mountCheck)
//   }
//   i++;
// }, 10)


onMounted(() => {
  if (props.infinite) {
    document.addEventListener('scroll', scroll);
  }
  likeList.value = $getLikedProducts();
})

function updateLikes(id) {
  likeList.value = $getLikedProducts();

  // Remove product from a list
  if (props.moodboard) {
    const index = props.productsData.data.findIndex(p => p.id === id)
    if (index !== -1) {
      // temporary Store removed product
      lastRemovedProduct.value = [index, props.productsData.data[index]]

      // Remove product
      props.productsData.data.splice(index, 1)

      // Show snackbar
      snackBar.value?.showSnackBar('Item removed from Moodboard', 'Undo')
    }
  }

  // console.log(props.productsData.data.pop());
}

addRouteMiddleware(async (to, from) => {
  if (props.infinite) {
    if (to.path !== from.path) {
      document.removeEventListener("scroll", scroll);
    }
  }
});


function undoHandler() {
  if (lastRemovedProduct.value.length > 0) {
    props.productsData.data.splice(lastRemovedProduct.value[0], 0, lastRemovedProduct.value[1])


    const id = lastRemovedProduct.value[1].id;
    $toggleLikeProduct(id)
  }
}

</script>

<style scoped lang="scss">

</style>
