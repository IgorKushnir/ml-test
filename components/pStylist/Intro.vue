<template>
  <div class="intro ratio-main-screen" :class="start ? 'start' :( hover ? 'hover' : '')">
    <Image class="hide-md" size="large" :path="data.cover_4x3" :alt="(!data.title || data.title === '') ? title : data.title"/>
    <Image class="show-md" :path="data.cover_3x4?.data ? data.cover_3x4 : data.cover_4x3" :alt="(!data.title || data.title === '') ? title : data.title"/>
    <div class="overlay"></div>
    <State
        :title="data.title"
        :text="data.description"
        white
        imagePath="/img/small-logo-light.svg"
        :button="{
            text: 'Take the Quiz',
            type: 'primary'
          }"
        @hover="hoverHandle"
        @click="clickHandle"
    />
  </div>
</template>

<script setup>
import State from "../State";

const emits = defineEmits(['start'])
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const hover = ref(false)
const start = ref(false)



function hoverHandle(status) {
  hover.value = status;
}
function clickHandle() {
  start.value = !start.value;

  emits('start')
  // setTimeout(() => emits('start'), 700)
}
</script>

<style scoped lang="scss">
$side: max(calc(((100vw - $grid-max-width) / 2) + 40px), 32px);

.intro {
  overflow: hidden;
  background-color: #4D4E56;
  position: relative;
}

.intro .overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: 0.5s ease-in-out;
  border: 0 solid white;
  background-color: $overlay;
}
.intro.hover .overlay {
  border-left: $side solid white;
  border-right: $side solid white;
  border-top: 10vh solid white;
  border-bottom: 10vh solid white;
}
.intro.start .overlay {
  transition: .7s;
  //border-left: 50vw solid white;
  //border-right: 50vw solid white;
  //border-top: 30vh solid white;
  //border-bottom: 50vh solid white;
  z-index: 1;
}

@include xl {
  .intro.hover .overlay {
   border: none;
  }
}


</style>
