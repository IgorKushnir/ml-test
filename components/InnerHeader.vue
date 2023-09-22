<template>
  <div class="sub-header-container ">
    <div class="container row justify-center">
      <div class="header col-6 col-10-lg col-12-md center">
        <div :class="sub_title || sub_header ? 'wrapper m-v-40 m-v-32-md' : 'wrapper'">

          <h1 class="title">
            <span class="subheader" v-if="sub_header" style="display: block">{{ sub_header }}<br></span>
            {{ title }}</h1>
          <p v-if="sub_title" style="margin: 0 auto">{{ sub_title }}</p>
        </div>
      </div>
    </div>

  </div>


</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  sub_title: {
    type: String,
    required: false
  },
  sub_header: {
    type: String,
    required: false
  },
})

</script>

<style scoped lang="scss">


.header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.sub-header-container {
  border-bottom: 1px solid $border-dark;
  .container {
    min-height: 152px;
  }
}
.wrapper > *:first-child{
  margin-top: 0;
}
.wrapper > *:last-child{
  margin-bottom: 0;
}

@include md {
  .sub-header-container {
    .container {
      min-height: 112px;
    }
  }
}

</style>
