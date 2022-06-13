<template>
  <ClientOnly>
    <teleport to="body">

      <transition name="slide">
        <div v-show="showFilters" class="wrapper">
          <div class="filters-container p-h-80 p-t-80 p-b-120">
            <template v-for="(filter, index) in allFilters">
<!--              :default-open="index < 2"-->
<!--              -->

              <FilterItem
                  v-if="filter.data.length > 0"
                  :name="filter.uid"
                  :data="filter.data"
                  :default-open="true"
                  @value="e => handleValue(e)"
                  :available-filter-items="availableFilters[filter.uid]"
              />
            </template>
            <div class="button-container p-v-16 p-h-80">
              <div class="button primary" v-on:click="handleFilterButton">
                <span v-if="!pending">Show {{ productsCount }}</span>
                <span v-else>...</span>
              </div>
            </div>
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


let filters = ref([])



function handleValue(e) {
  const index = filters.value.findIndex(d => d.key === e.key)
  if (index === -1) {
    filters.value.push(e)
  } else {
    filters.value[index] = e
  }

  emits('checkFilters', filters.value)
}

function handleFilterButton() {
  closeFilter();
  emits('filters', filters.value);
}

function closeFilter() {
  // document.body.classList.remove('no-scroll')
    emits("close");
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

@include md {
  .filters-container {
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
