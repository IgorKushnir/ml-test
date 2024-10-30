<template>
  <div>
    <Seo :data="data?.attributes" :breadcrumbs="[
        {
          title: 'Trunk shows',
          path: '/trunk-shows/' + data?.attributes?.slug,
        },
        {
          title: data?.attributes?.title,
        }
    ]"
         :pathToPage="{en: 'trunk-shows', pl: 'pokazy'}"
         :localizations="data?.attributes?.localizations?.data"
    />

    <transition name="fade">
      <div v-if="!pending && data != null">
        <TrunkShowInfo :data="data" />
        <Carusel
            class="show-md"
            v-if="data.attributes.products?.data?.length > 0"
            :data="data.attributes.products.data"
            :column="4"
            col-class="col-8 col-10-xl col-12-lg"
            layout="normal"
            nav-compact
        >
          <h2 class="m-t-0 m-b-40 m-b-24-md">Product offered</h2>
        </Carusel>
        <OfferedProducts v-if="data.attributes.products?.data?.length > 0" :productsData="data.attributes.products.data" />
      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>
</template>

<script setup>
import {getTrunkShow} from '~/api/trunkShows'
import OfferedProducts from '~/components/OfferedProducts';
import TrunkShowInfo from '~/components/TrunkShowInfo.vue';

const route = useRoute();
const slug = route.params.slug;
const { locale } = useI18n()

const {data, pending, refresh} = await getTrunkShow(slug, locale.value)

onMounted(() => {
  refresh()
})
</script>

<style scoped lang="scss">
@media (hover: hover) {
  :deep(.img-component.base) {
    transition: .3s ease-in-out;
  }
  :deep(.m-t-16) {
    transition: 0.2s ease-in-out;
  }
  .img-hover:hover {

    :deep(.img-component.base) {
      transform: scale(1.1);
    }

    :deep(.m-t-16) {
      transform: translateY(-4px);
    }
  }
}
</style>
