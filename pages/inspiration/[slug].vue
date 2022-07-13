<template>
  <div>
    <Seo :data="data?.attributes"/>

    <transition name="fade">
      <div v-if="!pending && data != null">
        <Container justify="justify-center">
          <div class="col-12">
            <div class="ratio-3x1 ratio-16x9-md">
              <Image :path="data.attributes.cover_3x1" :alt="data.attributes.title" size="large"/>
            </div>
          </div>
        </Container>

        <Container justify="justify-center">
          <div class="col-8 col-12-md p-t-0 p-b-0">
            <h1 class="title center m-t-0">{{data.attributes.title}}</h1>
            <p class="center">{{ $getDate(data.attributes.created, $getMonths) }}</p>
          </div>
        </Container>

        <Content :data="data.attributes.content"/>

      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="!pending && data === null"/>
  </div>
</template>

<script setup>
import {getInspiration} from '~/api/inspiration'

const route = useRoute()
const slug = route.params.slug
const { $getDate, $getMonths } = useNuxtApp()

const {data, pending, refresh, error} = await getInspiration(slug, 'en')
onMounted(() => {
  refresh()
})

</script>

