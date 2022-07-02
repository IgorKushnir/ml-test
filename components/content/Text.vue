<template>
  <div class="text-content" v-html="data"/>
</template>

<script setup>

const props = defineProps({
  data: {
    type: String,
    required: true
  }
})





</script>

<style lang="scss">
.text-content img {
  max-width: 100%;
}


.text-content > .history {
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
.text-content >  .key {
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
  .text-content > .history {
    column-count: 1;
    &  > div {
      padding-top: 16px;
      margin-top: 16px;
    }

    .li-title {
      font-size: 20px;
    }
  }

  .text-content >  .key {
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


// Table
.text-content table {
  width: 100%;
  border-spacing: 0;
  p {
    font-size: 16px;
  }
  th {
    background-color: $gray;
    p {
      color: $white;
      text-align: left;
    }
  }
  tr:nth-child(2n) {
    background-color: rgb($light-gray, 0.5);
  }
  tr:nth-child(2n -1) {
    background-color: $light-gray;
  }
  td, th {
    padding: 0 16px;
  }
}

</style>
