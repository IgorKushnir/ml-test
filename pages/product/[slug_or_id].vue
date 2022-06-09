<template>
  <div>
    <div v-if="!pending && data != null">
      <InnerHeader :title="data.title" :sub_title="data.description"/>
    </div>
    <Loading v-if="pending"/>
    <PageNotFound v-if="data === null"/>
  </div>
</template>

<script setup>
import getProduct from '~/api/getProductBySlugOrId'

const route = useRoute();
let slug_or_id = route.params.slug_or_id;


let {data, pending, refresh, error} = await getProduct(slug_or_id)
onMounted(() => refresh())


</script>

<style scoped>

</style>
