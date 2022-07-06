<template>
  <div>
    <transition name="fade">
      <div v-if="newsData != null">
        <InnerHeader title="News"/>
        <div class="container">
          <div class="row justify-center">
            <div class="col-8 col-10-xl col-12-lg">
              <Container class="p-h-0">
                <div class="col-6 col-12-sm m-b-40 m-b-0-sm" v-for="item in newsData.data">
                  <NewsItem :data="item"/>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Loading :pending="pending"/>
    <PageNotFound :show="newsData === null"/>
  </div>
</template>

<script setup>
import {getNews} from '~/api/news'
const page = ref(1);
const {data: newsData, pending, refresh, error} = await useLazyAsyncData('news', () => getNews('en',  page.value), {
  transform: (d) => {
    return d.data['news']
  }
})

</script>

<style scoped>

</style>
