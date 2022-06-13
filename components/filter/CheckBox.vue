<template>
  <div :class="'check-box-container' + (value ? ' active' : '') + (!available ? ' not-available' : '')" v-on:click="available ? $emit('value', !value) : ''">
    <div class="check-box"/>
    <div class="label">{{ label }}</div>
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
  }
})

</script>

<style scoped lang="scss">
.check-box-container {
  height: 24px;
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
}
.label {
  display: inline-block;
  vertical-align: super;
  margin-left: 16px;
}
.active {
  .check-box {
    position: relative;
    background-color: $gray;
    border: 1px solid $gray;
  }
  .check-box:after {
    content: '';
    width: 12px;
    height: 12px;
    position: absolute;
    left: 5px;
    top: 5px;
    background-color: $light-gray;
  }
  .label {
    font-weight: bold;
  }
}
</style>
