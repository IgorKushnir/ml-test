<template>
<NuxtLink :to="to" class="searchTag p-h-12 p-v-16 border link">
  <slot/>
</NuxtLink>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String
  }
})

</script>

<style scoped lang="scss">
.searchTag {
  /*border: 1;*/
  border: 1px solid $border-dark;
  display: flex;
  gap: 8px;
  justify-items: center;
  align-items: center;
  text-wrap: nowrap;
  //max-width: 300px
}
.searchTag:hover {
  background-color: $light-gray;
}
.link {
  font-weight: normal!important;
}
:deep(strong) {
  //color: #00dc82;
}
</style>
