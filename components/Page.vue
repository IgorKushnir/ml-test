<template>
  <div>
    <transition name="fade">
      <div class="content" v-if="!pending && data != null">
        <InnerHeader v-if="!data.banner" :title="data.title" :sub_header="data.sub_header" :sub_title="data.text"/>

        <ContentBanner :data="data.banner" :title="data.title" :text="data.text" />

        <Content :data="data.content"/>

      </div>
    </transition>
    <PageNotFound :show="!pending && data === null"/>
    <Loading :pending="pending"/>
    <Seo :data="data" :breadcrumbs="[
        {
          title: data?.title,
        }
    ]"
         :localizations="data?.localizations?.data"
    />
  </div>
</template>

<script setup lang="js">
import getPage from '~/api/getPage'


const route = useRoute();
let slug = route.params.slug;
let draft = route.query?.draft;

let publicationState = "LIVE";
if (draft === 'true') {
  publicationState = "PREVIEW";
}




const { locale } = useI18n()




let { data, pending, refresh, error } = await getPage(slug, locale.value, publicationState)


</script>

<style scoped lang="scss">
//.component-text:deep(*) {
//  column-count: 1!important;
//}
//.content:deep(img) {
//  width: 100%;
//
//}

</style>
