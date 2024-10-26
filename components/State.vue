<template>
  <div class="container stage p-v-80 p-v-40-md">
    <div class="row gap-S justify-center">
      <div class="state-container col-6 col-12-md center">
        <div v-if="!hideIcon" class="icon">
          <nuxt-img :src="imagePath" alt="Milla Nova" />
        </div>
        <h1 v-if="title" :class="white ? 'white' : ''">{{ title }}</h1>
        <p v-if="text" :class="white ? 'white' : ''">{{text}}</p>

        <div v-if="button" class="m-b-40 m-b-24-md m-t-32">
          <NuxtLink v-if="button.path"
                    :to="button.path"
                    v-on:click="clickHandle"
                    v-on:mouseenter="hoverHandle(true)"
                    v-on:mouseleave="hoverHandle(false)"
                    class="button"
                    :class="(white ? 'white ' : '') + (button.type ? ' ' + button.type : '') + (button.target ?? '')" >{{ button.text }}</NuxtLink>
          <div v-else
               v-on:click="clickHandle"
               v-on:mouseenter="hoverHandle(true)"
               v-on:mouseleave="hoverHandle(false)"
               class="button"
               :class="(white ? 'white ' : '') + (button.type ? ' ' + button.type : '') + (button.target ?? '')">{{ button.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["click", "hover"])
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
  },
  white: {
    type: Boolean,
    required: false,
    default: false
  }
})
function clickHandle() {
  emits('click')
}
function hoverHandle(status) {
  emits('hover', status)
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
