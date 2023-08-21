<template>
  <div>
    <Seo :data="data" :breadcrumbs="[
        {
          title: 'Contact us',
        }
    ]"/>
    <transition name="fade">
      <div v-if="data != null">
        <transition name="fade">
          <ContactIntro v-if="!type" :data="data"/>
          <ContactForm v-else :data="data" :type="type"/>
        </transition>
      </div>
    </transition>

    <Loading :pending="pending"/>
    <PageNotFound :show="data === null && !pending"/>
  </div>
</template>

<script setup>
import getContacts from '~/api/contact'
const {data, pending, refresh, error} = await getContacts('en')

const route = useRoute()
const query = ref(route.query)
console.log(route);
watch(() => route.query, (r) => {
  query.value = route.query
})
const type = computed(() => Object.keys(query.value)[0])







</script>

<style scoped>

</style>
