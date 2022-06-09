<template>
  <div>
    <div v-if="!pending && data != null">
      <InnerHeader :title="data.title" :sub_header="data.line.data.attributes.title" :sub_title="data.description"/>

      {{data.products.data.length}}
      <StickyBar :title="data.title" />
      <Button v-on:click="handler">{{ colum }}</Button>
      <!-- 3 col grig-->
      <div class="container flex">
        <div class="row gap-S m-v-80 m-v-24-xl">
          <div :class="colum ? 'c col-4 col-6-lg col-12-md' : 'c col-3 col-6-lg col-12-md'" v-for="product in data.products.data">
            <ProductItem :title="product.attributes.title" :to="'/product/' + product.attributes.slug"
                         :image="product.attributes.cover_3x4"/>
          </div>
        </div>
      </div>
    </div>

    <Loading v-if="pending"/>
    <PageNotFound v-if="data === null"/>

  </div>
</template>

<script setup lang="ts">
import getCollection from '~/api/getCollection'

const route = useRoute();
let slug = route.params.slug;


let {data, pending, refresh, error} = await getCollection(slug, 'en')
onMounted(() => refresh())

let colum = ref(true);


function handler() {
  colum.value = !colum.value
}

</script>

<style scoped>
.c {
  transition: .5s;
}

</style>
