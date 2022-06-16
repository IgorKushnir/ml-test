<template>
  <ClientOnly>
    <teleport to="body">

      <transition name="slide">
        <div v-show="showFilters" class="wrapper">
          <div class="filters-container p-h-56 p-t-80 p-v-120    p-h-32-md">

            <div class="header-container p-r-0">
              <div class="btn close" v-on:click="closeFilter"><div class="icon-close-24"></div></div>
              <h4 class="title"><strong>Filters</strong></h4>

              <transition name="fade">
                <div v-if="isSelectedFilters" v-on:click="resetHandler" class="btn reset p-small"><strong>Reset all</strong></div>
              </transition>
            </div>

            <template v-for="(filter, index) in allFiltersFiltered">

              <FilterItem
                  :name="filter.uid"
                  :data="filter.data"
                  :default-open="index < 1"
                  @value="e => handleValue(e)"
                  :available-filter-items="availableFilters[filter.uid]"
              />
            </template>

            <transition name="fade">
            <div v-if="!showFilterButton" class="button-container p-v-16 p-h-56  p-h-32-md">
              <div class="button primary" v-on:click="handleFilterButton">
                <span v-if="!pending">Show {{ productsCount }}</span>
                <span v-else>...</span>
              </div>
            </div>
            </transition>

            <div class="close-overlay" v-on:click="closeFilter"/>

          </div>

        </div>

      </transition>

      <Transition name="fade">
        <div v-if="showFilters" class="overlay"/>
      </Transition>

    </teleport>
  </ClientOnly>
</template>

<script setup>
const emits = defineEmits(["close", "filters", "checkFilters"])

const props = defineProps({
  showFilters: {
    type: Boolean,
    required: true
  },
  allFilters: {
    type: Object,
    required: true
  },
  availableFilters: {
    type: Object,
    required: true
  },
  productsCount: {
    type: Number,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  }
})



watch(() => props.showFilters, (e) => {
  e ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')
})

const allFiltersFiltered = computed(()=> {
  return props.allFilters.filter(d => d.data.length > 0)
})

const filters = ref([])

const selectedItems = ref([])
const filteredItems = ref([])
const showFilterButton = ref(false);

function checkIsFilterButtonShow() {
  showFilterButton.value = JSON.stringify(selectedItems.value) === JSON.stringify(filteredItems.value);
}
checkIsFilterButtonShow()

function handleValue(e) {
  let currentSelected = []
  props.allFilters.forEach(e => {
    e.data.forEach(d => {
      currentSelected.push(d.attributes.value);
    })
  })
  if (filteredItems.value.length === 0) {
    filteredItems.value = currentSelected.map(e => false);
  }
  selectedItems.value = currentSelected;

  checkIsFilterButtonShow()


  const index = filters.value.findIndex(d => d.key === e.key)
  if (index === -1) {
    filters.value.push(e)
  } else {
    filters.value[index] = e
  }


  emits('checkFilters', filters.value)
}

function handleFilterButton() {
  filteredItems.value = selectedItems.value;
  checkIsFilterButtonShow()
  closeFilter();
  emits('filters', filters.value);
}

function closeFilter() {
    emits("close");
}
const isSelectedFilters = computed(()=> {
  let selected = []
  props.allFilters.forEach(f => {
    f.data.forEach(e => {
      if (e.attributes.value) {
        selected.push(true)
      }
    })
  })
  return selected.length > 0
})



function resetHandler() {
  filters.value.forEach(v => {
    v.values = []
  })
  emits('filters', filters.value);

  props.allFilters.forEach(f => {
    f.data.forEach(e => {
      e.attributes.value = false
    })
  })

  emits('checkFilters', filters.value)

  selectedItems.value = []
  filteredItems.value = []
  checkIsFilterButtonShow()

}




</script>

<style scoped lang="scss">
$desktop_size: 500px;
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 99;

}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $overlay;
  z-index: 98;
}
.close-overlay {
  position: absolute;
  top: 0;
  left: calc(-100vw + 100%);
  width: calc(100vw - 100%);
  height: 100%;
}
.filters-container {
  position: absolute;
  right: 0;
  width: $desktop_size;
  min-height: 100%;
  background-color: $white;
  margin-left: auto;
}

.button-container {
  position: fixed;
  width: $desktop_size;
  bottom: 0;
  right: 0;
  background-color: $white;
  border-top: 1px solid $border-dark;
}
.button {
  display: block;
}
.header-container {
  position: fixed;
  display: flex;
  justify-content: space-between;
  height: 56px;
  width: $desktop_size;
  top: 0;
  right: 0;
  background-color: $white;
  border-bottom: 1px solid $border-dark;
  z-index: 99;
  .title {
    font-size: inherit;
    margin-left: 24px;
    margin-right: auto;
  }
}
.btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: .3s;

  &:hover {
    background-color: $light-gray;
  }
  &.close {
    font-size: 24px;
    width: 56px;
    height: 100%;
    border-right: 1px solid $border-dark;
  }
  &.reset {
    padding: 0 32px;
    height: 100%;
    border-left: 1px solid $border-dark;
  }
}

@include md {

  .filters-container, .header-container, .button-container {
    width: 100%;
  }
}





.slide-enter-active,
.slide-leave-active {
  .button-container {
    display: none;
  }
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(500px, 0);
}

</style>
