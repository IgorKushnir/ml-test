<template>
  <div class="container stage p-v-80 p-v-40-md">
    <div class="row gap-S justify-center">
      <div class="state-container col-6 col-12-md center">
        <div v-if="!hideIcon" class="icon">
          <img :src="imagePath" alt="Milla Nova">
        </div>
        <h1 v-if="title">{{ title }}</h1>
        <p v-if="text">{{text}}</p>
        <Button v-if="button" :path="button.path" v-on:click="clickHandle" class="m-b-40 m-b-24-md m-t-32">{{ button.text }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["click"])
defineProps({
  hideIcon: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
  button: {
    type: Object,
    required: false,
  },
  imagePath: {
    type: String,
    required: false,
    default: '/img/small-logo-dark.svg'
  }
})
function clickHandle() {
  emits('click')
}
</script>

<style scoped lang="scss">


.stage {
  min-height: calc(100vh - 152px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.state-container {
  //display: flex;
  //flex-direction: column;
  //align-items: center;
}
.icon img {
  background-image: none;
  height: 100px;
  margin: 0 auto 32px;
}



.half {
  min-height: calc(100vh - 370px);
}
@include md {
  .half {
    min-height: calc(100vh - 230px);
  }
}


</style>
