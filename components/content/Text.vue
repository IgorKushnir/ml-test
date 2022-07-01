<template>
  <div v-html="data"/>
</template>

<script setup>

const props = defineProps({
  data: {
    type: String,
    required: true
  }
})





</script>

<style lang="scss" scoped>
>>> .history {
  column-count: 2;
  color: $gray;

  &  > div {
    display: inline-flex;
    column-gap: 16px;
    align-items: baseline;
    border-top: 1px solid $border-dark;
    padding-top: 24px;
    margin-top: 40px;
  }

  .li-title {
    font-size: 24px;
    font-weight: bold;
    color: $dark-blue;
  }
}
>>> .key {
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(3, 1fr);
  color: $gray;
  text-align: center;

  &  > div {
    padding: 0 40px;
  }

  .li-title {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: bold;
    color: $dark-blue;
  }
}
@include md {
  >>> .history {
    column-count: 1;
    &  > div {
      padding-top: 16px;
      margin-top: 16px;
    }

    .li-title {
      font-size: 20px;
    }
  }

  >>> .key {
    grid-gap: 20px;
    p {
      line-height: 1.2em;
    }
    &  > div {
      padding: 0 0px;
    }

    .li-title {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }
}

</style>
