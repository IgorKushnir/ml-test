<template>
  <div>
    <Seo :data="data" title="Collections" :breadcrumbs="[
        {
          title: 'Collections',
        }
    ]"
         :localizations="[{locale: 'en', slug: 'collections'}, {locale: 'pl', slug: 'collections'}]"

    />
    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader title="Collections"/>
        <StickyBarStickyHeaderMilla>
          <!--        // Data types to global data-->
          <template #center>
            <StickyBarStickyMenu :data="typeData" path="/" class="grid-column-center"/>
          </template>
        </StickyBarStickyHeaderMilla>

        <Container>
          <template v-for="line in data">
            <div class="col-12 subheader small center m-b-0 m-t-16 show-sm">{{line.title}}</div>

            <div v-for="collection in line.collections.data" class="col-4 col-6-xl col-12-sm">
              <CollectionItem
                  :title="collection.attributes.title"
                  :sub-header="line.title"
                  :image="collection.attributes.cover_3x4"
                  :to="localePath('/collection/' + collection.attributes.slug)"
              />
            </div>
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
import StickyHeaderMilla from "../stickyBar/StickyHeaderMilla";

const { locale } = useI18n()

let {data, pending, refresh, error} = await getCollections(locale.value)

const typeData = useTypesData()


</script>

<style scoped>

</style>
