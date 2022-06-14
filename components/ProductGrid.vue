<template>

  <transition name="fade">
    <Container v-if="!pendingProducts && productsData.length > 0">
      <template  v-for="(product, index) in productsData">

        <slot name="promo" v-if="index === 0"/>
        <slot name="fact" v-if="promo ? (index === 8) : (index === 7)"/>

        <div :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-12-sm'">
          <ProductItem :title="product.attributes.title" :to="'/product/' + product.attributes.slug"
                       :image="product.attributes.cover_3x4"/>
        </div>
      </template>
    </Container>
  </transition>



  <transition name="fade">
    <Loading v-if="pendingProducts"/>
  </transition>

  <transition name="fade">
    <State v-if="productsData && productsData.length === 0" title="No products"></State>
  </transition>

</template>

<script setup>
const prop = defineProps({
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
    required: true
  }
})

</script>

<style scoped>

</style>
