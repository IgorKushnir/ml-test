<template>
  <div class="select">
    <div
        :class="_index !== -1 ? 'custom-select active desktop' : 'custom-select desktop'"
        @mouseenter="showDropdown = true"
        @mouseleave="showDropdown = false"
    >
      <StoreFlag v-if="flag && _index!== -1 && data[_index]?.flag" class="flag big" :code="data[_index].flag"/>

      <div class="label p-small">
        <strong>{{ _index === -1 ? name : data[_index].value }}</strong>
        <div class="icon-drop-down-16"></div>
      </div>

      <transition name="dropdown">
        <div v-show="showDropdown" ref="dropDown" :class="'drop-down ' + side">
          <div class="search-wrap" v-if="searchable">
              <div class="icon-search-24 icon-search"/>
            <input type="text" v-model="search" class="search" placeholder="Enter the city" @keyup.enter="onSearch"/>
          </div>
          <div :class="_index === -1 ? 'item active p-small' : 'item p-small'" v-on:click="onAllClick">{{all}}</div>
          <div v-for="(item) in filteredData" :class="_index === item.index ? 'item active p-small' : 'item p-small'" v-on:click="emitIndex(item.index)">
            <StoreFlag v-if="flag && data[item.index]?.flag" class="flag" :code="data[item.index].flag"/>
            <span>{{item.value}}</span>
          </div>
        </div>
      </transition>
    </div>

    <div  class="select-container mobile">
      <StoreFlag v-if="flag && _index !== -1 && data[_index]?.flag" class="flag-mobile" :code="data[_index].flag"/>

      <select :class="'select custom-select p-small hidden' + (flag && _index !== -1 ? ' flag' : '')">
        <option value="1">{{_index === -1 ? all : data[_index].value}}</option>
      </select>

      <div class="icon-drop-down-16"></div>

      <select :class="(_index === -1 ? 'select custom-select p-small absolute' : 'select custom-select p-small absolute active') + (flag && _index !== -1 ? ' flag' : '')" v-on:change="emitIndex( _index)" v-model="_index">
        <option :value="-1" @click="search = ''">{{all}}</option>
        <option  v-for="(item) in filteredData" :value="item.index" :selected="index === item.index">{{item.value}}</option>

      </select>
    </div>
  </div>

</template>

<script setup>
const emits = defineEmits(["index"]);

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  all: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  index: {
    type: Number,
    required: false,
    default: -1
  },
  flag: {
    type: Boolean,
    return: false,
    default: false
  },
  side: {
    type: String,
    required: false,
    default: 'left'
  },
  searchable: {
    type: Boolean,
    return: false,
    default: false
  },
})
let showDropdown = ref(false)
const _index = ref(props.index);
const dataWithIndex = computed(() => props.data.map((item, index) => ({...item, index})))
const search = ref('')
const filteredData = computed(() => dataWithIndex.value.filter(item => item.value.toLowerCase().includes(search.value.toLowerCase())))
const onAllClick = () => {
  emitIndex( -1)
  search.value = ''
}

watch(() => props.index, (i) => {
  _index.value = i
})

function emitIndex(index) {
  // console.log({index});
  emits("index", index);
}


</script>



<style scoped lang="scss">


.select {
  display: inline-block;
  vertical-align: middle;
}
.custom-select {
  position: relative;
  height: 64px;
  margin: -1px -0.5px 0 -0.5px;
  display: inline-block;
  padding: 19px 32px;
  border: 1px solid $border-dark;
  cursor: pointer;
  &.active {
    border-bottom: 2px solid $dark-blue;
  }
}



.drop-down {
  position: absolute;
  left: -1px;
  top: calc(100% + 1px);
  min-width: 300px;
  height: auto;
  max-height: 330px;
  overflow-y: auto;
  background-color: $white;
  border: 1px solid $border-dark;
}
.drop-down.right {
  left: unset;
  right: -1px;
}
.item {
  position: relative;
  padding: 20px 24px;
  border-bottom: 1px solid $border-dark;
  transition: .3s;
  z-index: 0;
}
.item.active {
  font-weight: bold;
  //background-color: $light-gray;
}
.item.active:after {
  content: "\e90d";
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  right: 24px;
}


.flag, .label {
  display: inline-block;
  vertical-align: middle;
}
.flag {
  margin-right: 12px;

  &.big {
    width: 32px;
    height: 18px;
    object-fit: cover;
  }
}

.icon-drop-down-16 {
  display: inline-block;
  font-size: 16px;
  height: 17px;
  margin-left: 12px;
  width: 16px;
  vertical-align: text-bottom;
}




select {
  appearance: none;
  padding-right: 20px!important;
  background-color: transparent;
  font-size: 16px;
  border: none;
  margin: 0;
  font-family: inherit;
  cursor: inherit;
  line-height: inherit;

  font-weight: bold;
  color: $dark-blue;
  //width: 140px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.select-container {
  margin: 0 -.5px;
  position: relative;
}
.absolute {
  position: absolute!important;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.hidden {
  visibility: hidden;
  border-width: 2px!important;
  //padding: 0 40px!important;
}


//select::-ms-expand {
//  //display: none;
//}
.item:before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background-color: rgba($light-gray, .5);
  z-index: -1;
  opacity: 0;
}



.custom-select {
  &.flag {
    padding: 15px 0px 15px 60px;
    margin-right: -60px;
  }
}
.icon-drop-down-16 {
  display: inline-block;
  width: 16px;
  height: 16px;
  font-size: 16px;
  margin-right: 24px;
  margin-bottom: 1px;
  margin-left: -14px;
  vertical-align: middle;
}
.flag-mobile {
  margin-left: 24px;
}
.desktop {
  display: none;
}
@media (hover: hover) {
  .desktop {
    display: inline-block;
  }
  .mobile {
    display: none;
  }
  .custom-select:hover {
    padding-top: 19px;
    background-color: $light-gray;
    border-top: 1px solid $border-dark;
    border-bottom: 2px solid $light-gray;
  }

  .item:hover:before {
    opacity: 1;
  }
  .icon-drop-down-16 {
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 16px;
  }
}

@include md {
  .custom-select {
    position: relative;
    height: 56px;
    padding: 15px 24px;
  }
}



.dropdown-enter-active {
  transition: all .3s ease-out;

}
.dropdown-leave-active {
}

.dropdown-enter-from {
  opacity: 0;
  transform: perspective(9cm) rotateX(-35deg);
  transform-origin:center top;
}
.dropdown-leave-to {
  opacity: 0;
}

.search-wrap {
  display: flex;
  align-items: center;
  padding: 0 30px;
  border: 1px solid $border-dark;
}

.search {
  height: 63px;
  padding-left: 16px;
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  color: $dark-blue;

  :focus {
    border: none;
    outline: none;
  }

  :placeholder {
    color: #B4BABF;
  }

  .icon-search {
    color: #B4BABF;
  }
}
</style>
