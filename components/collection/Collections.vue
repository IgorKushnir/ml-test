<template>
  <div>
    <Seo :data="data" :title="$t('collections')" :breadcrumbs="[
        {
          title: $t('collections'),
        }
    ]"
         :localizations="[{locale: 'en', slug: 'collections'}, {locale: 'pl', slug: 'kolekcje'}]"

    />
    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader :title="$t('collections')"/>
        <StickyBarStickyHeaderMilla>
          <template #center>
            <StickyBarStickyMenu :data="typeData" path="/" class="grid-column-center"/>
          </template>
        </StickyBarStickyHeaderMilla>

        <Container v-if="data?.length > 0">
          <template v-for="line in data">
            <div class="col-12 subheader small center m-b-0 m-t-16 show-sm">{{line?.title}}</div>

            <template v-if="line?.collections?.data?.length > 0">
              <div v-for="(collection, index) in line.collections.data" class="col-4 col-6-xl col-12-sm">
                <CollectionItem
                    :title="collection?.attributes?.title"
                    :sub-header="line?.title"
                    :image="collection?.attributes?.cover_3x4"
                    :to="localePath(`/collection/${collection.attributes.slug}`)"
                    :lazyLoadImage="index !== 0"
                />
              </div>
            </template>
          </template>
        </Container>
      </div>
    </transition>

    <Loading :pending="pending"/>

    <PageNotFound :show="data === null"/>
  </div>
</template>

<script setup>
import getCollections from '~/api/getCollections'
import {useTypesData} from "../../composables/states";

const { locale } = useI18n()

let {data, pending} = await getCollections(locale.value)

const typeData = useTypesData()
</script>

<style scoped>

</style>
