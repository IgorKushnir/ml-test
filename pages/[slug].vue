<template>
  <Discover v-if="isType"/>
  <Page v-else/>
</template>

<script setup>
import PageNotFound from "../components/PageNotFound";

const typeData = useTypesData()
const route = useRoute()

const isType = computed(() => {
  return typeData.value.map(t => t.slug).includes(route.params.slug)
})
</script>
