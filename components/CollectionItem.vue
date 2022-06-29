<template>
  <div class="ratio-3x4">
    <NuxtLink :to="to" class="collection-item">
      <Image :path="image" :alt="title"  size="medium" class="ratio-3x4"/>

      <div class="collection-item-head" :class="gradient ? 'gradient' : ''">
        <div class="collection-content p-v-56 p-h-56 p-v-32-md p-h-16-md">
          <p class="subheader">{{subHeader}}</p>
          <h2>{{title}}</h2>
          <p v-if="text">{{ text }}</p>

          <div class="p-v-16">
            <div class="button white">{{ button_text }}</div>
          </div>
        </div>

      </div>


    </NuxtLink>
  </div>

</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subHeader: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  image: {
    type: Object,
    required: true
  },
  button_text: {
    type: String,
    required: false,
    default: 'Explore'
  },
  gradient: {
    type: Boolean,
    required: false,
    default: false
  }
})


</script>

<style scoped lang="scss">
.collection-item > * {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.collection-item-head {
  background-color: $overlay;
  text-align: center;
  *{
    color: $white;
  }
}
.collection-item-head.gradient {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .6) 100%);
}

.collection-content {
  position: absolute;
  bottom: 0;
  width: 100%;
}


</style>
