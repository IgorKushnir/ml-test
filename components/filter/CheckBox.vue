<template>
  <div v-if="available" :class="'check-box-container' + (value ? ' active' : '')"
       v-on:click="available ? $emit('value', !value) : ''">
    <div class="check-box"/>
    <div class="p label">{{ label }}</div>
    <div class="p-small gray m-l-40" v-if="description">{{ description }}</div>
  </div>
</template>

<script setup>
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
  description: {
    type: String,
    required: false
  }
})

</script>

<style scoped lang="scss">


.check-box-container {
  //height: 24px;
  margin: 24px 0;
  cursor: pointer;
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

@media (hover: hover) {
  .check-box-container:hover {
    .check-box {
      background-color: $light-gray;
    }
  }

  .check-box-container.active:hover {
    .check-box {
      background-color: $gray;
    }
    .check-box:after {
      opacity: .8;
    }
  }
}
</style>
