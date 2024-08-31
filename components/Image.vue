<template>
  <component :is="canZoom ? 'a' : 'div'" :href="canZoom ? $getImage(path, 'large') : null"
             :data-pswp-width="path?.data?.attributes?.formats?.large?.width"
             :data-pswp-height="path?.data?.attributes?.formats?.large?.height"
             data-cropped="true"
             class="img-component-container" :class="(zoom && !path.data?.attributes?.mime?.startsWith('video/')) ? 'zoom' : ''" v-on:click="() => showZoomImage(path)">

    <img
        v-if="!path.data?.attributes?.mime?.startsWith('video/')"
        :src="$getImage(path, size)"
        :alt="path.data?.attributes?.alternativeText ?? alt"
        class="img-component base"
        loading="lazy"
    />
    <img :src="placeholder" :alt="alt" class="img-component placeholder">

    <video
        v-if="path.data?.attributes?.mime?.startsWith('video/')"
        playsinline=""
        :src="$getAbsoluteUrl(path.data.attributes.url)"
        loop="loop"
        tabindex="-1"
        muted autoplay
        aria-hidden="true"
        :type="path.data.attributes.mime"
    />

  </component>
</template>

<script setup>
// import {useIsMobile, useZoomImage} from "../composables/states";

const { $getAbsoluteUrl,  $getImage} = useNuxtApp();

let props = defineProps({
  path: {
    type: Object,
    required: true
  },
  alt: {
    type: String,
    required: false,
    default: "Milla Nova"
  },
  size: {
    type: String,
    required: false,
    default: 'medium'
  },
  zoom: {
    type: Boolean,
    required: false
  }
})

const placeholder = computed(() => {
  if (!props.path.data?.attributes?.placeholder) return "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAgEAACAgEDBQAAAAAAAAAAAAABAgADBgQFBxESIjFB/8QAFAEBAAAAAAAAAAAAAAAAAAAABP/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAwDAQACEQMRAD8AsuO8a4dXj+2I+ObTe66WoG27R1O7nsHkzFepJ9k/TERBgZMV2//Z"
  return props.path.data.attributes.placeholder
})


const isNotSvg = computed(() => props.path.data?.attributes?.url.endsWith('.jpg') || props.path.data?.attributes?.url.endsWith('.jpeg') || props.path.data?.attributes?.url.endsWith('.png') || props.path.data?.attributes?.url.endsWith('.JPG') || props.path.data?.attributes?.url.endsWith('.JPEG') || props.path.data?.attributes?.url.endsWith('.PNG'))

const canZoom = computed(() => props.zoom && !props.path.data?.attributes?.mime?.startsWith('video/'))
// const zoomImage = useZoomImage();
// const isMobile = useIsMobile();

function showZoomImage(path) {
  // if (props.zoom && !props.path.data?.attributes?.mime?.startsWith('video/')) {
  //   zoomImage.value = path;
  // }
}

// function loaded() {
//   console.log('done');
// }

</script>

<style lang="scss">


.img-component-container {
  overflow: hidden;
}

.img-component {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-component.base {
  z-index: 1;
}
.img-component.placeholder {
  filter: blur(40px);
  transform: scale(1.5);
  z-index: 0;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

//.zoom-icon {
//  position: absolute;
//  right: 8px;
//  top: 8px;
//  width: 40px;
//  height: 40px;
//  //background-color: #000000;
//}
.img-component-container.zoom {
  cursor: zoom-in;
}
</style>
