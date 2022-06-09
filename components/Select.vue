<template>
  <div :class="index !== -1 ? 'custom-select active' : 'custom-select'" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false" @click="showDropdown = false">
    <StoreFlag v-if="flag && index!== -1" class="flag big" :code="data[index].flag"/>

    <div class="label p-small">

      <strong>{{ index === -1 ? name : data[index].value }}</strong>
    </div>
    <div v-show="showDropdown" ref="dropDown" class="drop-down">
      <div :class="index === -1 ? 'item active p-small' : 'item p-small'" v-on:click="$emit('index', -1)">{{name}}</div>
      <div v-for="(item, i) in data" :class="index === i ? 'item active p-small' : 'item p-small'" v-on:click="$emit('index', i)">
        <StoreFlag v-if="flag" class="flag" :code="data[i].flag"/>
        <span>{{item.value}}</span>
      </div>
    </div>


<!--    <select class="select" v-on:change="$emit('index', index)" v-model="index">-->
<!--      <option :value="-1">{{name}}</option>-->
<!--      <option  v-for="(item, i) in data" :value="i" :selected="index === i">{{item.value}}</option>-->
<!--    </select>-->
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
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
  }
})
let showDropdown = ref(false)

// let index = ref(props.index)

// defineEmits({
//   index: {
//
//   }
// })

// function handleClick(i) {
//   console.log(i);
//   index.value = i.value;
//
//   // this.$emit('index', index)
// }

// onMounted(() => {
//
// })

</script>



<style scoped lang="scss">
.custom-select {
  position: relative;
  height: 64px;
  margin: -1px -0.5px 0 -0.5px;
  display: inline-block;
  padding: 19px 32px;
  border-left: 1px solid $border-dark;
  border-right: 1px solid $border-dark;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;

  &:hover {
    padding-top: 18px;
    background-color: $light-gray;
    border-top: 1px solid $border-dark;
    border-bottom: 2px solid $light-gray;
  }
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
  max-height: 300px;
  overflow-y: auto;
  background-color: $white;
  border: 1px solid $border-dark;
}
.item {
  padding: 20px 24px;
  border-bottom: 1px solid $border-dark;
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





.select {
  //display: none;

}
select {
appearance: none;
background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
}
select::-ms-expand {
  display: none;
}



</style>
