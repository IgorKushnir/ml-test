<template>
  <Discover v-if="isType"/>
  <Page v-else/>
</template>

<script setup>



const typeData = useTypesData()
const route = useRoute()

const isType = computed(() => {
  return typeData.value.map(t => t.slug).includes(route.params.slug)
})



</script>
