<template>
  <div>
    <Seo :data="data?.attributes" :breadcrumbs="[
        {
          title: 'Inspiration',
          path: '/inspiration/' + data?.attributes?.slug
        },
        {
          title: '' + data?.attributes?.title
        }
    ]"
         :pathToPage="{en: 'inspiration', pl: 'inspiracja'}"
         :localizations="data?.attributes?.localizations?.data"
    />
    <transition name="fade">
      <div v-if="!pending && data != null">
        <Container justify="justify-center">
          <div class="col-12">
            <div class="ratio-3x1 ratio-16x9-md">
              <Image :path="data.attributes?.cover_3x1" :alt="data.attributes?.title" size="large"/>
            </div>
          </div>
        </Container>

        <Container justify="justify-center">
          <div class="col-8 col-12-md p-t-0 p-b-0">
            <h1 class="title center m-t-0">{{ data.attributes.title }}</h1>
            <p class="center">{{ $getDate(data.attributes.created, $getMonths) }}</p>
          </div>
        </Container>

        <template v-for="content in data.attributes?.content">
          <Content :data="content"/>
        </template>

      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="!pending && data === null"/>

  </div>
</template>

<script setup>
import {getInspiration} from '~/api/inspiration'

const route = useRoute()
const slug = route.params.slug
const {$getDate, $getMonths} = useNuxtApp()

const { locale } = useI18n()

const {data, pending} = await getInspiration(slug, locale.value)
</script>

