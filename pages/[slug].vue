<template>

<!--  <pre>{{route.name}}</pre>-->
  <Discover v-if="isType"/>
  <Page v-else/>
</template>

<script setup>
import PageNotFound from "../components/PageNotFound";

// definePageMeta({
//   pageTransition: false,
//   // layoutTransition: false
// })

const typeData = useTypesData()
const route = useRoute()

const isType = computed(() => {
  return typeData.value.map(t => t.slug).includes(route.params.slug)
})
</script>
