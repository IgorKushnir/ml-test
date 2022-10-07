<template>
  <div v-if="available"
       :class="['check-box-container', (value ? 'active' : ''),  (box ? ' box p-h-24 p-v-16 m-v-8' : 'm-v-24'), (single ? 'single' : '')].join(' ')"
       v-on:click="available ? $emit('value', !value) : ''">
    <div v-if="!single" class="check-box"/>
    <div class="p label">{{ label }}</div>
    <span v-if="single" class="icon-arrow-16"/>
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
  }
})

</script>

<style scoped lang="scss">


.check-box-container {
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
.single {
  .p.label {
    margin-right: 16px;
    margin-left: 0;
  }
}
.box {
  border: 1px solid $border-dark;
  display: flex;
  justify-content: space-between;
  .check-box {
    flex-shrink: 0;
  }
  .p.label {
    flex-grow: 1;
  }
}
.active.box {
  background-color: $light-gray;
}
.icon-arrow-16 {
  float: right;
}
@media (hover: hover) {
  .check-box-container:hover {
    .check-box {
      background-color: $light-gray;
    }
  }
  .check-box-container.box:hover {
    background-color: $light-gray;
    .check-box {
      background-color: $white;
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
