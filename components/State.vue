<template>
  <div class="container stage p-v-80 p-v-40-md">
    <div class="row gap-S justify-center">
      <div class="state-container col-6 col-12-md center">
        <div v-if="!hideIcon" class="icon">
          <img src="@/assets/img/small-logo-dark.svg" alt="">
        </div>
        <h1>{{ title }}</h1>
        <p v-if="text">{{text}}</p>
        <Button v-if="button" :path="button.path" class="m-b-40 m-b-24-md m-t-32">{{ button.text }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hideIcon: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  button: {
    type: Object,
    required: false,
  }
})
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
  width: 100px;
  margin: 0 auto 32px;
}

</style>
