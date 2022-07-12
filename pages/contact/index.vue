<template>
  <div>
    <transition name="fade">
      <div v-if="data != null">
        <transition name="fade">
          <ContactIntro v-if="!type" :data="data"/>
          <ContactForm v-else :data="data" :type="type"/>
        </transition>
      </div>
    </transition>

    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>
</template>

<script setup>
import getContacts from '~/api/contact'
const {data, pending, refresh, error} = await getContacts('en')

const route = useRoute()
const query = ref(route.query)
watch(route, (r) => query.value = r.query)
const type = computed(() => Object.keys(query.value)[0])

useHead({
  title: data.value.seo?.metaTitle ?? data.value.title,
})



</script>

<style scoped>

</style>
