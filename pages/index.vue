<template>
  <div>
    <transition name="fade">
      <div class="content" v-if="!pending && data != null">
        <ContentBanner v-if="data?.attributes?.banner" :data="data.attributes.banner" type="main"/>
        <template v-if="data.attributes.content">
          <template v-for="content in data.attributes.content">
            <Content :data="content"/>
          </template>
        </template>
      </div>
    </transition>
    <PageNotFound :show="!pending && data === null"/>
    <Loading :pending="pending"/>

    <Seo v-if="data?.attributes" :data="data.attributes" :localizations="[{locale: 'en', slug: ''}, {locale: 'pl', slug: ''}]"/>
  </div>
</template>

<script setup lang="ts">
import getMain from '~/api/getMain'

const { locale } = useI18n()

let { data, pending } = await getMain(locale.value)
</script>

<style scoped>

</style>
