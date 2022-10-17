<template>
  <div>
    <Seo title="Personal stylist" :breadcrumbs="[
        {
          title: 'Personal stylist',
        }
    ]"/>
    <div v-if="!pending && data">
      <Transition name="fade" mode="out-in">
        <PStylistIntro
            v-if="!start"
            :data="data"
            @start="start = true"
        />
        <div v-else>
          <pStylistQuestions :data="data"/>
        </div>
      </Transition>
    </div>

    <Loading :pending="pending"/>

  </div>

</template>

<script setup>
import personalStylistResponse from '~/api/getPersonalStylist'

const {data, pending, refresh, error} = useLazyAsyncData('personalStylist', () => personalStylistResponse({ lang: "en" }), { transform: (d) => d.data?.personalStylist?.data?.attributes })

const start = ref(false)


</script>

<style scoped>

</style>
