<template>
  <div>

    <transition name="fade">
      <div class="content" v-if="!pending && data != null">
        <ContentBanner :data="data.attributes.banner" type="main"/>

        <!-- <Content :data="data.attributes.content"/> -->

      </div>
    </transition>
    <PageNotFound :show="!pending && data === null"/>
    <Loading :pending="pending"/>

    <Seo :data="data?.attributes" :localizations="[{locale: 'en', slug: ''}, {locale: 'pl', slug: ''}]"/>
  </div>
</template>

<script setup lang="ts">
import getMain from '~/api/getMain'

const { locale } = useI18n()

let { data, pending, refresh, error } = await getMain(locale.value)

</script>

<style scoped>


</style>
