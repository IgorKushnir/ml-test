<template>
  <div class="box p-v-16 p-h-16 p-v-8-md p-h-8-md" v-on:click="available ? $emit('value', !value) : ''" :class="[ (value ? 'active' : ''), (single ? 'single' : '')].join(' ')">
    <div class="ratio-3x4">
      <Image :path="image"/>
    </div>
    <div class="check-box-container m-t-16 m-b-8-md">
      <div v-if="!single" class="check-box"/>
      <div class="p label">{{ label }}</div>
      <span v-if="single" class="icon-arrow-16 m-t-4"/>
    </div>
  </div>
</template>

<script setup>
import Image from "../Image";

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Boolean,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  },
  box: {
    type: Boolean,
    required: false,
    default: false
  },
  single: {
    type: Boolean,
    required: false,
    default: false
  },
  image: {
    type: Object,
    required: true
  }
})

</script>

<style scoped lang="scss">
.check-box-container {
  display: flex;
  align-items: flex-start;
  //justify-content: space-between;
}


.not-available {
  opacity: .2;
  cursor: not-allowed;

  .check-box:after {
    display: none;
    background-color: $light-gray;

  }

  .check-box {
    background-color: $gray;

  }
}

.check-box {
  width: 24px;
  height: 24px;
  display: inline-block;
  border: 1px solid $border-dark;
  transition: .2s;
}

.check-box:after {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  left: 11px;
  top: 11px;
  background-color: $light-gray;
  transition: .2s;
}

.label {
  display: inline-block;
  vertical-align: super;
  margin: 0 0 0 16px;
  color: $dark-blue;
}

.active {
  .check-box {
    position: relative;
    background-color: $gray;
    border: 1px solid $gray;
  }

  .check-box:after {
    width: 12px;
    height: 12px;
    left: 5px;
    top: 5px;
  }

  .label {
    font-weight: bold;
  }
}
.single {
  .p.label {
    margin-right: 16px;
    margin-left: 0;
  }
}
.box {
  border: 1px solid $border-dark;
  cursor: pointer;
  height: 100%;
  //display: flex;
  //justify-content: space-between;
  //.check-box {
  //  flex-shrink: 0;
  //}
  //.p.label {
  //  flex-grow: 1;
  //}
}
.active.box {
  background-color: $light-gray;
}
.icon-arrow-16 {
  float: right;
  margin-left: auto;
}
@media (hover: hover) {
  .box:hover {
    background-color: $light-gray;
  }

  .box.active:hover {
    .check-box {
      background-color: $gray;
    }
    .check-box:after {
      opacity: .8;
    }
  }
}
</style>
