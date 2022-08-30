<template>
  <div :class="'filter p-small' + ( count > 0 ? ' active' : '' ) ">
    <span class="icon-settings-16"/>
    <div><strong>Filter</strong> <span v-if="count > 0">({{ count }})</span></div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: false,
    default: 0
  }
})

</script>

<style scoped lang="scss">


.filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  margin: -1px;
  border: 1px solid $border-dark;
  padding: 0 25px;
  cursor: pointer;

  & > * {
    padding: 0 6px;
  }

  &:hover {
    background-color: $light-gray;
  }

  &.active {
    border-bottom: 2px solid $dark-blue;
    padding-top: 1px;
  }
}

@include md {
  .filter {
    height: 56px;
    padding: 0 14px;
    & > * {
      padding: 0 6px;
    }
  }
}

</style>
