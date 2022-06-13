<template>
  <div v-if="pendingProducts">pendingProducts</div>

  <template v-if="!pendingProducts" v-for="(product, index) in productsData">

<!--    <div >-->
      <slot v-if="index === 8" />
<!--    </div>-->

    <div :class="grid === 3 ? 'col-4 col-6-lg col-12-sm' : 'col-3 col-4-lg col-12-sm'">
      <ProductItem :title="product.attributes.title" :to="'/product/' + product.attributes.slug"
                   :image="product.attributes.cover_3x4"/>
    </div>
  </template>

  <div v-if="productsData && productsData.length === 0">No products</div>

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
  }
})

</script>

<style scoped>

</style>
