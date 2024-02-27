<template>
  <div>
    <Seo :data="data" :breadcrumbs="[
        {
          title: 'Contact us',
        }
    ]"
         :localizations="[{locale: 'en', slug: 'contact'}, {locale: 'pl', slug: 'kontakt'}]"
    />
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
const { locale } = useI18n()

const {data, pending, refresh, error} = await getContacts(locale.value)

const route = useRoute()
const query = ref(route.query)

watch(() => route.query, (r) => {
  query.value = route.query
})
const type = computed(() => query.value.form)







</script>

<style scoped>

</style>
