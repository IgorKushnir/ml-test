<template>
  <div class="filter-item-container">
    <div class="head" v-on:click="openHandler">
      <span class="nav-link"><strong>{{ name }}</strong><span v-if="amount > 0"> ({{ amount }})</span></span>
      <div v-if="open" class="icon-drop-up-16"></div>
      <div v-else class="icon-drop-down-16"></div>
    </div>
    <transition name="slide-fade" @enter="enterAnimation" @leave="leaveAnimation">
      <div v-if="open">
        <div :class="'p-v-8 ' + data.uid">

          <template v-for="(filter, i) in filterItemData">
            <FilterCheckBox
                v-if="data.uid !== 'silhouettes'"
                :label="filter.title"
                :value="filter.value"
                @value="e => setItemValue(i, e)"
                :available="isFilterItemsAvailable(filter)"
            />
            <FilterCheckBoxDress
                v-if="data.uid === 'silhouettes' && isFilterItemsAvailable(filter)"
                :filter="filter"
                @value="e => setItemValue(i, e)"
            />
          </template>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import {enter, leave} from "~/api/misc/transitions";
import FilterCheckBoxDress from "./FilterCheckBoxDress";

const emits = defineEmits(["value"]);

const props = defineProps({
  name: {
    type: String,
    required:true
  },
  data: {
    type: Object,
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
  },
  initialItemSelected: {
    type: Array,
    required: false
  },
})

let open = ref(false)
open.value = props.defaultOpen;

let filterItemData = ref([])
const amount = computed(()=> {
  const am = filterItemData.value.filter(d => d.value)?.length
  if (am > 0) open.value = true;
  return am
})





function checkSelected() {
  // console.log(props.data.data);
  filterItemData.value = props?.data?.data.map(d => {
    let m = d.attributes;
    if (props.initialItemSelected) {
      m.value = props.initialItemSelected.includes(m.slug);
    } else {
      m.value = false;
    }
    // console.log(m.slug, m.value);
    return m;
  })
}
checkSelected()
watch(() => props.initialItemSelected, () => {
  checkSelected()
})


function setItemValue(i, e) {
  filterItemData.value[i].value = e;

  let filters = filterItemData.value.filter(d => d.value)

  filters = {
    key: props?.data.uid,
    values: filters.map(d => d.slug)
  }

  emits("value", filters);
}




function openHandler() {
  open.value = !open.value
}


const enterAnimation = (e) => enter(e)
const leaveAnimation = (e) => leave(e)


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

.silhouettes {
  padding: 32px 0!important;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
}
@media (hover:hover) {
  .head:hover {
    background-color: rgb($light-gray, .5);
  }
}

@include md {
  .silhouettes {
    grid-template-columns: repeat(4, 1fr);
  }
}
@include sm {
  .silhouettes {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 370px) {
  .silhouettes {
    grid-template-columns: repeat(2, 1fr);
  }
}




</style>
