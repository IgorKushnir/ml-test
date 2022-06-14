<template>
  <div>
    <div v-if="!pending && data != null">
      <InnerHeader title="Collections"/>
      <StickyHeader>
<!--        // Data types to global data-->
        <template #center>
          <StickyMenu :data="typeData" path="/discover/" class="grid-column-center"/>
        </template>
      </StickyHeader>

      <Container>
        <template v-for="line in data">
          <div class="col-12 subheader small center m-b-0 m-t-16 show-sm">{{line.title}}</div>

          <div v-for="collection in line.collections.data" class="col-4 col-6-xl col-12-sm">
            <CollectionItem
                :title="collection.attributes.title"
                :sub-header="line.title"
                :image="collection.attributes.cover_3x4"
                :to="'/collections/' + collection.attributes.slug"
            />
          </div>
        </template>
      </Container>
    </div>

    <Loading v-if="pending"/>
    <PageNotFound v-if="data === null"/>
  </div>
</template>

<script setup>

import getCollections from '~/api/getCollections'
import {useTypesData} from "../../composables/states";

let {data, pending, refresh, error} = await getCollections('en')

const typeData = useTypesData()


</script>

<style scoped>

</style>
