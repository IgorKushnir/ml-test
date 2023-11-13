<template>
  <div>
    <Seo title="Inspiration" :breadcrumbs="[
        {
          title: 'Inspiration',
        }
    ]"/>

    <transition name="fade">
      <div v-if="data != null">
        <InnerHeader title="Inspiration"/>

        <Container>
          <template v-for="(item, index) in data.data">
            <InspirationItem v-if="[0, 9, 16, 25, 32].includes(index) && (!useIsMobile().value)" :title="item.attributes.title" :to="localePath('/inspiration/'+item.attributes.slug)" :cover="item.attributes.cover_3x1" col="col-8 col-6-xl col-12-md"/>
            <InspirationItem v-else :title="item.attributes.title" :to="localePath('/inspiration/'+item.attributes.slug)" :cover="item.attributes.cover_1x1" col="col-4 col-6-xl col-12-md"/>
          </template>

        </Container>


      </div>
    </transition>


    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>

</template>

<script setup>
import {getCategories, getInspirations} from '~/api/inspiration'

const route = useRoute()
const nuxtApp = useNuxtApp()
const page = ref(1);
// const data = ref()

const { locale } = useI18n()

const {data, pending, refresh, error} = await useLazyAsyncData('inspirations', () => getInspirations(locale.value, null, page.value), {
  transform: (d) => {
    // if (page.value === 1) {
    //   console.log('here');
    //   data.value = d.data['inspirations']
    // }

    return d.data['inspirations']
  }
})
// if (page.value === 1) {
//   data.value = postData.value
// }
//
// onMounted(() => {
//   data.value = postData.value
//   // refresh()
// })

// watch(postData, () => {
//   if (!data.value) {
//     data.value = postData.value
//   }
// })
// watch(route, (_) => {
//   page.value = 1;
//   refreshNuxtData('inspirations').then(() => {
//     data.value = postData.value
//   })
//
// })


nuxtApp.hook('page:loadNext', () => {
  const currentPage = data.value.meta.pagination.page;
  if (currentPage < data.value.meta.pagination.pageCount && page.value !== currentPage+1) {
    console.log('load: ' + (currentPage+1));
    page.value = currentPage+1;

    const d = data.value.data;
    refreshNuxtData('inspirations').then(() => {
      data.value.data = [...d, ...data.value.data]
    })

  }
})




</script>
