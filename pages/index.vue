<template>
  <div>
    <transition name="fade">
      <div class="content" v-if="!pending && data != null">
        <ContentBanner :data="data.attributes.banner" type="main" />

        <Content :data="data.attributes.content"/>

      </div>
    </transition>
    <PageNotFound :show="!pending && data === null"/>
    <Loading :pending="pending"/>
  </div>
</template>

<script setup lang="ts">
import getMain from '~/api/getMain'

let { data, pending, refresh, error } = await getMain('en')




</script>

<style scoped>


</style>
