<template>
  <div>
    <div class="content" v-if="!pending && data != null">
      <InnerHeader :title="data.title" :sub_header="data.sub_header" :sub_title="data.sub_title"/>

      <div class="container">
        <template v-for="content in data.content">
          <div class="row gap-S justify-center">
            <div class="component-text col-8" v-if="content['__typename'] === 'ComponentContentText'" v-html="content.text"/>
          </div>

        </template>
      </div>
    </div>

    <Loading v-if="pending"/>
    <PageNotFound v-if="data === null" />
  </div>
</template>

<script setup lang="ts">
import getMenu from '~/api/getPage'


const route = useRoute();
let slug = route.params.slug;


let { data, pending, refresh, error } = await getMenu(slug, 'en')
onMounted(() => refresh())

</script>

<style scoped lang="scss">
.component-text:deep(*) {
  column-count: 1!important;
}
.content:deep(img) {
  width: 100%;

}

</style>
