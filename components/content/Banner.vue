<template>
  <div v-if="data" class="banner ratio-main-screen">
    <Image :path="data.media" :alt="data.title ?? data.title !== '' ? data.title : title"/>
    <div class="overlay"/>
    <div class="wrapper">
      <Container :justify="type === 'main' ? '' : 'justify-center'">
        <div  :class="type === 'main' ? 'col-4 col-6-lg col-12-md p-v-0' : 'col-6 col-10-lg col-12-md p-v-0 center'">
          <h1 class="white" :class="type === 'main' ? '' : 'title'">{{data.title ?? data.title !== '' ? data.title : title}}</h1>
          <p class="white">{{data.text ?? data.text !== "" ? data.text : text}}</p>

          <NuxtLink v-if="data.button" :to="data.button_link" class="button white m-v-32">{{ data.button_text }}</NuxtLink>
          <div v-if="!data.button" class="arrow-down icon-arrow-16 white m-t-56 m-t-32-md m-b-32"/>
        </div>
      </Container>
    </div>

  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false,
    default: "inner"
  }
})

</script>

<style scoped lang="scss">

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}


.overlay {
  background-color: $overlay;
}

.arrow-down {
  border-radius: 50%;
  transform: rotate(90deg);
}




</style>
