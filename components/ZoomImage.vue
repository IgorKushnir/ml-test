<template>
  <transition name="fade">
    <div class="zoom" :class="touchScreen ? 'touch' : ''" v-if="zoomImage">
      <div v-if="touchScreen">
        <div class="close-button icon-close-24" v-on:click="close"/>
        <PinchScrollZoom
            ref="zoomer"
            centered
            within
            key-actions
            :width="width"
            :height="height"
            :min-scale="1"
            :max-scale="4"
            :content-width="zoomImage.data.attributes.width"
            :content-height="zoomImage.data.attributes.height"
        >
          <div class="zoom-container overflow-hidden" ref="image"
               :style="'aspect-ratio: ' + zoomImage.data.attributes.width + '/' + zoomImage.data.attributes.height"
          >
            <Image
                :path="zoomImage"
                size="large"
                v-on:mousemove="mouse"
            />

          </div>
        </PinchScrollZoom>
      </div>

      <div v-if="!touchScreen" v-on:click="close" class="zoom-container" ref="image"
           :style="'aspect-ratio: ' + zoomImage.data.attributes.width + '/' + zoomImage.data.attributes.height"
      >
        <Image
            :path="zoomImage"
            size="large"
            v-on:mousemove="mouse"
        />

      </div>

    </div>
  </transition>

</template>

<script setup>
import {useZoomImage} from "~/composables/states";
import '@coddicat/vue-pinch-scroll-zoom/style.css';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';

const zoomImage = useZoomImage();
const image = ref()
const width = ref(0)
const height = ref(0)

let shiftY = 0;
const parallax = 0.1;
let imageH = 0
let y = 0

let touchScreen = false;
if (process.client) {
  touchScreen = 'ontouchstart' in window
}
// let touchScreen = true;


function mouse(e) {
  const rect = image.value?.getBoundingClientRect();
  if (!rect) return
  imageH = rect.height + 48 * 2
  y = e.clientY / window.innerHeight;


}

function animate() {
  if (!touchScreen && image.value) {
    shiftY += (y - shiftY) * parallax;
    // console.log(shiftY);
    image.value.style.top = -(shiftY * (imageH - window.innerHeight)) + 'px'
    requestAnimationFrame((t) => animate(t));
  }
}

function start() {
  shiftY = 0
  imageH = 0
  y = 0
  // console.log({imageH});
  animate()
  document.body.style.overflow = 'hidden'


  width.value = window.innerWidth
  height.value = window.innerHeight
  // console.log(image.value.children[0]);
}

function close() {
  zoomImage.value = null
  document.body.style.overflow = 'unset'
}

watch(zoomImage, () => {
  if (zoomImage.value) {
    nextTick(() => {
      start()
    })
  }
})


const zoomer = ref();


onMounted(() => {
  width.value = window.innerWidth
  height.value = window.innerHeight
  // console.log(width.value, height.value);
})


</script>

<style scoped lang="scss">
.zoom-container {
  position: relative;
  //width: 200px;
}
.zoom-container.overflow-hidden {
  overflow: hidden;
}

.zoom.touch {
  padding: 0;
}

.zoom.touch > .zoom-container {
  max-height: 100vh;
}

.zoom {
  position: fixed;
  padding: 48px;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  background: $white;
  //background: rgba(5, 28, 44, 0.70);
  //backdrop-filter: blur(27px);
  cursor: zoom-out;
  //overflow-y: scroll;
  overflow: hidden;
}
.close-button {
  position: fixed;
  top: 16px;
  right: 16px;
  background-color: $dark-blue;
  z-index: 9;
  color: $white;
  padding: 16px;
}
</style>
