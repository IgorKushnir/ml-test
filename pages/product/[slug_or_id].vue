<template>
  <div>
    <div v-if="!pending && data != null">
      <InnerHeader :title="data.title" :sub_title="data.description"/>

      <StickyHeader :title="data.title">
        <div class="grid-column-end">
          <StickyBarBack reverse text="Previous" @clicks="e => nextHandler(e)" />
          <StickyBarBack text="Next"/>
        </div>
      </StickyHeader>

      <pre>{{data}}</pre>
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

function nextHandler(e) {
  console.log(e);
}


</script>

<style scoped>

</style>
