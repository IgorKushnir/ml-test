<template>
  <div>
    <Seo title="News" :breadcrumbs="[
        {
          title: $t('news'),
        }
    ]"
         :localizations="[{locale: 'en', slug: 'news'},{locale: 'pl', slug: 'aktualnosci'}]"
    />

    <transition name="fade">
      <div v-if="newsData != null">
        <InnerHeader :title="$t('news')"/>
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
const { locale } = useI18n()

const {data: newsData, pending} = await useLazyAsyncData('news', () => getNews(locale.value), {
  transform: (transformData) => transformData?.data['news']
})
</script>

<style scoped>

</style>
