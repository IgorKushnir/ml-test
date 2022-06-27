<template>

  <transition name="fade">
    <Container v-if="productsData  && productsData?.data?.length > 0">
      <template  v-for="(product, index) in productsData.data">

        <slot name="promo" v-if="index === 0"/>
        <slot name="fact" v-if="promo ? (index === 8) : (index === 7)"/>

        <div :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-12-sm'">
          <ProductItem :title="product.attributes.title" :to="'/' + product.attributes.type.data.attributes.slug + '/' + product.attributes.slug"
                       :image="product.attributes.cover_3x4"/>
        </div>
      </template>
    </Container>
  </transition>



  <Loading :pending="pendingProducts"  extended-class="half"/>
  <transition name="fade">
    <State v-if="productsData && !pendingProducts && productsData.data.length === 0" title="No products"  class="half"></State>
  </transition>


  <div v-if="infinite" ref="loader" style="text-align: center; padding: 80px">
    <div v-if="showLoader">
    </div>
  </div>

</template>

<script setup>
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
  }
})

const loader = ref();
let showLoader = ref(false)

watch(() => props.productsData.data, () => {
  showLoader.value = false
})

function needsToLoad() {
  return (props.productsData !== null) && (props.productsData.meta.pagination.pageCount > 0 ) && (props.productsData.meta.pagination.page < props.productsData.meta.pagination.pageCount )
}

function scroll() {
  document.addEventListener('scroll', function(e) {
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

  });
}


onMounted(() => {
  if (props.infinite) {
    document.addEventListener('scroll', scroll);
  }
})

addRouteMiddleware(async (to, from) => {
  if (props.infinite) {
    if (to.path !== from.path) {
      document.removeEventListener("scroll", scroll);
    }
  }
});

</script>

<style scoped lang="scss">

</style>
