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
      :initialFilterSelected="initialFilterSelected"
      :pendingInitial="pendingInitial"
  />
</template>

<script setup>
const emits = defineEmits(["filters", "checkFilters"])
const props = defineProps({
  availableFilters: {
    type: Object,
    required: true
  },
  initialFilterSelected: {
    type: Array,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  },
  pendingInitial: {
    type: Boolean,
    required: true
  },
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

calculateFiltersAmount(props.initialFilterSelected);
watch(() => props.initialFilterSelected, () => {
  calculateFiltersAmount(props.initialFilterSelected);
})

const isMobile = useIsMobile()

function toggleFilters(state) {
  showFilters.value = state;
}

function emitFilters(e) {
  emits('filters', e)
  count.value = e.map(d => d.values.length).reduce((partialSum, a) => partialSum + a, 0)
}
function checkFiltersHandler(f) {
  emits('checkFilters', f)
}
function calculateFiltersAmount(filters) {
  count.value = filters.map(d => d.values.length).reduce((partialSum, a) => partialSum + a, 0)
}
</script>

<style scoped>

</style>
