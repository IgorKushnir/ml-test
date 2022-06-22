<template>
  <div>
    <transition name="fade">
      <div v-if="!pending && data != null">
        <Container justify="justify-center">
          <div class="col-8 col-10-xl col-12-lg">
            <div class="ratio-16x9">
              <Image :path="data.attributes.cover_4x3" alt=""/>
            </div>

            <div class="head center m-v-80">
              <div class="subheader gray">Trunk show</div>
              <h1 class="title">{{data.attributes.title}}</h1>
              <NuxtLink v-if="data.attributes.apply_for" :to="data.attributes.apply_for" target="_blank" class="button primary target m-v-8">Apply for</NuxtLink>
            </div>

            <div v-html="data.attributes.content"/>



          </div>
        </Container>

        <Carusel
            v-if="data.attributes.offered"
            title="Product offered"
            :data="data.attributes.offered.products.data"
            column="4"
            col-class="col-8 col-10-xl col-12-lg"
        />

      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>
</template>

<script setup>
import {getTrunkShow} from '~/api/trunkShows'
const route = useRoute();
let slug = route.params.slug;

let {data, pending, refresh, error} = await getTrunkShow(slug, 'en')

onMounted(() => {
  refresh()
})

</script>

<style scoped>

</style>
