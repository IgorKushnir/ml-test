<template>
  <div>
    <transition name="fade">
      <div v-if="data != null">
        <InnerHeader title="Inspiration"/>
        <StickyHeader v-if="categoryData.length > 0">
          <template #center>
            <StickyMenu :data="categories" path="?category=" :activeItem="activeCategoryIndex"/>
          </template>
        </StickyHeader>

        <Container>
          <template v-for="(item, index) in data.data">
            <InspirationItem v-if="[0, 9, 16, 25, 32].includes(index)" :title="item.attributes.title" :to="'/inspiration/'+item.attributes.slug" :cover="item.attributes.cover_3x1" col="col-8 col-6-xl col-12-md"/>
            <InspirationItem v-else :title="item.attributes.title" :to="'/inspiration/'+item.attributes.slug" :cover="item.attributes.cover_1x1" col="col-4 col-6-xl col-12-md"/>
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
let category = ref( route.query.category);
const nuxtApp = useNuxtApp()
const page = ref(1);
const data = ref()

const {data: categoryData, pending: categoryPending, refresh: categoryRefresh, error: categoryError} = await getCategories('en')
const {data: postData, pending, refresh, error} = await useLazyAsyncData('inspirations', () => getInspirations('en', category.value, page.value), {
  transform: (d) => {
    return d.data['inspirations']
  }
})

onMounted(() => {
  data.value = postData.value
  // refresh()
})

watch(postData, () => {
  if (!data.value) {
    data.value = postData.value
  }
})
watch(route, (_) => {
  category.value = route.query.category
  page.value = 1;
  refresh().then(_ => {
    data.value = postData.value
  })
})
nuxtApp.hook('page:loadNext', () => {
  const currentPage = data.value.meta.pagination.page;
  if (currentPage < data.value.meta.pagination.pageCount) {
    console.log('load: ' + (currentPage+1));
    page.value = currentPage+1;
    refresh().then(_ => {
      data.value.meta = postData.value.meta
      data.value.data = [...data.value.data, ...postData.value.data]
    })
  }
})

const activeCategoryIndex = computed(()  => {
  let index = 0;
  if (route.query.category) {
    index = categoryData.value.findIndex(d => d.attributes.slug === route.query.category) + 1
  }
  return index
})



const categories = computed(()  => {
  const cat = categoryData.value.map(d => {
    return d.attributes
  })
  const all = {
    slug: 'all',
    title: 'all',
  }

  return [all, ...cat]

})



</script>
