<template>
  <NuxtLink :class="col" :to="to">
    <div class="ratio-1x1">
      <Image :path="cover" :alt="title"/>
      <div class="overlay"></div>
      <div class="title-container p-v-40 p-h-40">
        <h3 class="m-b-0">{{title}}</h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  cover: {
    type: Object,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  col: {
    type: String,
    required: true
  }
})

</script>

<style scoped lang="scss">
@import  "/assets/style/global.scss";

.overlay {
  width: 100%;
  height: 100%;
  background-color: $overlay;
}

.title-container {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  color: $white;
  h3 {
    display: block;/* or inline-block */
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.col-8 {
  .title-container {
    width: 50%;
  }
  .ratio-1x1 {
    padding-bottom: calc(50% - 20px);
  }
}
</style>
