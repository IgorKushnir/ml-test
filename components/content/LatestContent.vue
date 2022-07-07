<template>


  <div v-if="data.instance === 'news' && newsData != null"
       class="col-4 col-6-lg col-12-sm"
       v-for="(item, index) in newsData.data"
       :class="index > 1 ? 'hide-lg' : ''"
  >
    <NewsItem :data="item"/>
  </div>

  <div v-if="data.instance === 'inspiration' && newsData != null"
       class="col-4 col-6-lg col-12-sm"
       :class="index > 1 ? 'hide-lg' : ''"
       v-for="(item, index) in newsData.data"
  >
    <InspirationItem :title="item.attributes.title" :to="'/inspiration/'+item.attributes.slug" :cover="item.attributes.cover_1x1" col=""/>

  </div>



</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
import {getNews} from '~/api/news'
import { getInspirations} from '~/api/inspiration'


const {data: newsData, pending, refresh, error} =
    props.data.instance === 'news' ? await useLazyAsyncData('news', () => getNews('en', 1, props.data.amount), {
  transform: (d) => {
    return d.data['news']
  }
}) : props.data.instance === 'inspiration' ? await useLazyAsyncData('inspirations', () => getInspirations('en', null, 1, props.data.amount), {
      transform: (d) => {
        return d.data['inspirations']
      }
    }) : null



</script>

<style scoped>


</style>
