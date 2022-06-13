<template>
  <div class="filter-item-container">
    <div class="head" v-on:click="openHandler">
      <span class="nav-link"><strong>{{ name }}</strong><span v-if="amount > 0"> ({{ amount }})</span></span>
      <div v-if="open" class="icon-drop-up-16"></div>
      <div v-else class="icon-drop-down-16"></div>
    </div>
    <div v-if="open" class="list">
      <FilterCheckBox
          v-for="(filter, i) in filterItemData"
          :label="filter.title"
          :value="filter.value"
          @value="e => setItemValue(i, e)"
          :available="isFilterItemsAvailable(filter)"
      />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["value"]);

const props = defineProps({
  name: {
    type: String,
    required:true
  },
  data: {
    type: Array,
    required: true
  },
  defaultOpen: {
    type: Boolean,
    required: false,
    default: false
  },
  availableFilterItems: {
    type: Object,
    required: true
  }
})
let open = ref(false)
open.value = props.defaultOpen;

let filterItemData = ref([])

filterItemData.value = props.data.map(d => {
  let m = d.attributes;
  m.value = false;
  return m;
})



function setItemValue(i, e) {
  filterItemData.value[i].value = e;

  let filters = filterItemData.value.filter(d => d.value)

  filters = {
    key: props.name,
    values: filters.map(d => d.slug)
  }

  emits("value", filters);
}

// const amount = 0
const amount = computed(()=> filterItemData.value.filter(d => d.value).length)



function openHandler() {
  open.value = !open.value
}


function isFilterItemsAvailable(filter) {
  const itemSlug = filter.slug;
  const availableSlugs = props.availableFilterItems.map(d => d.slug);
  return availableSlugs.includes(itemSlug)
}

</script>

<style scoped lang="scss">
.head {
  border-width: 1px 0;
  border-style: solid;
  border-color: $border-dark;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -1px;
  cursor: pointer;
}
.list {
  padding: 8px 0;
}

</style>
