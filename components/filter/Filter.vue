<template>
  <FilterButton v-on:click="toggleFilters(true)" :count="count" />
  <FilterModal
      v-if="availableFiltersFirstFetch.filters != null"
      :show-filters="showFilters"
      :all-filters="allFilters"
      :available-filters="availableFiltersFirstFetch.filters"
      @close="toggleFilters(false)"
      @filters="e => emitFilters(e)"
      :products-count="availableFilters.pagination.total ?? 0"
      @check-filters="e => checkFiltersHandler(e)"
      :pending="pending"
  />
</template>

<script setup>
const emits = defineEmits(["filters", "checkFilters"])
const props = defineProps({
  availableFilters: {
    type: Object,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  }
})

// Get Available Filters just Once
const availableFiltersFirstFetch = ref(props.availableFilters)
watch(() => props.availableFilters, (f)=> {
  if (f.filters != null) {
    availableFiltersFirstFetch.value = f
  }
})





import {useFiltersData} from "~/composables/states";

let allFilters = useFiltersData();
let showFilters = ref(false)
let count = ref(0)

const isMobile = useIsMobile()

function toggleFilters(state) {
  showFilters.value = state;
}

function emitFilters(e) {
  window.scrollTo({
    top: isMobile.value ? 0 : 153,
    behavior: 'smooth'
  });
  emits('filters', e)
  count.value = e.map(d => d.values.length).reduce((partialSum, a) => partialSum + a, 0)
}
function checkFiltersHandler(f) {
  emits('checkFilters', f)
}
</script>

<style scoped>

</style>
