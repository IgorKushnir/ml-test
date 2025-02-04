<template>
<!--  <pre>{{productsData}}</pre>-->
  <SnackBar ref="snackBar" @action="undoHandler"/>
  <transition name="fade">
    <Container v-if="productsData  && productsData?.data?.length > 0">
      <!--    v-if="productsData  && productsData?.data?.length > 0"-->
      <template v-for="(product, index) in productsData.data">
        <slot name="promo" v-if="index === 0"/>
        <slot name="fact" v-if="promo ? (index === 8) : (index === 7)"/>


        <div :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-6-md col-12-sm'">
          <!--          {{index+1}}<br>{{product?.attributes?.silhouettes?.data?.attributes?.slug}}-->
          <ProductItem :title="product.attributes.title"
                       :to="'/' + (product.attributes.type.data?.attributes.slug ?? 'product') + '/' + product.attributes.slug"
                       :image="product.attributes.cover_3x4"
                       :gallery="product.attributes.gallery"
                       :id="product.id"
                       :like-list="likeList"
                       @updateLikes="updateLikes"
                       @onProductClick="onProductClick"
                       :hideLikedDefault="moodboard"
                       :product-type="product?.attributes?.type?.data?.attributes?.slug"
                       :showLike="showLike"
          />
        </div>
      </template>

      <template v-if="shimmerItems && pendingProducts" v-for="index in Array.from(Array(shimmerItems ?? 0).keys())">
        <div class="shimmer" :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-6-md col-12-sm'">
          <ProductItem shimmer/>
        </div>
      </template>
    </Container>
  </transition>


  <transition name="fade">
    <div v-if="productsData && !pendingProducts && productsData?.data?.length === 0">
      <State v-if="!moodboard" title="No products" class="half"></State>
      <State v-if="moodboard"
             :title="$t('moodboard_empty_title')"
             :text="$t('moodboard_empty_description')"
             :button="{text: $t('discover'), path: localePath(locale === 'en' ? '/dress' : '/suknie')}"
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
const localePath = useLocalePath()

const snackBar = ref(null);
const { locale } = useI18n()

const emits = defineEmits(['load', 'click'])
const props = defineProps({
  productsData: {
    type: Object,
    required: false
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
  },
  shimmerItems: {
    type: Number,
    required: false,
    default: 0
  },
  showLike: {
    type: Boolean,
    default: true
  }
})
const {$getLikedProducts, $toggleLikeProduct} = useNuxtApp()
const onProductClick = () => emits('click')

const loader = ref();
let showLoader = ref(false)
const likeList = ref([])
const lastRemovedProduct = ref([])

watch(() => props.productsData, () => {
  // console.log('false');
  showLoader.value = false
})

function needsToLoad() {
  return (props.productsData !== null) && (props.productsData.meta.pagination.pageCount > 0) && (props.productsData.meta.pagination.page < props.productsData.meta.pagination.pageCount)
}

function scroll() {
  if (loader.value !== null) {
    if (props.productsData !== null && !props.pendingProducts) {
      if (needsToLoad()) {
        const loaderY = loader.value.getBoundingClientRect().top - window.innerHeight;
        if (loaderY < 0) {
          if (!showLoader.value) {
            // console.log('true');
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
    document.addEventListener('scroll', scroll, {passive: true});
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
  if (lastRemovedProduct.value?.length > 0) {
    props.productsData.data.splice(lastRemovedProduct.value[0], 0, lastRemovedProduct.value[1])


    const id = lastRemovedProduct.value[1].id;
    $toggleLikeProduct(id)
  }
}

</script>

<style scoped lang="scss">

</style>
