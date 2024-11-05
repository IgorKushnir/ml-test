<template>
  <component :is="canZoom ? 'a' : 'div'" :href="canZoom ? $getImage(path, 'large') : null"
             :data-pswp-width="path?.data?.attributes?.formats?.large?.width"
             :data-pswp-height="path?.data?.attributes?.formats?.large?.height"
             data-cropped="true"
             class="img-component-container" :class="(zoom && !path.data?.attributes?.mime?.startsWith('video/')) ? 'zoom' : ''" v-on:click="() => showZoomImage(path)">

    <NuxtImg
        v-if="!path.data?.attributes?.mime?.startsWith('video/')"
        :src="$getImage(path, size)"
        :alt="path.data?.attributes?.alternativeText ?? alt"
        class="img-component base"
        :loading="lazy ? 'lazy' : null"
        format="webp"
    />
    
    <video ref="mainVideo" v-if="path.data?.attributes?.mime?.startsWith('video/')" muted autoplay playsinline :poster="poster" loop tabindex="-1">
      <source ref="videoSource" :type="path.data.attributes.mime" aria-hidden="true">
    </video>
    
    <NuxtImg :src="placeholder" :alt="alt" class="img-component placeholder" format="webp" />
    
  </component>
</template>

<script setup>
// import {useIsMobile, useZoomImage} from "../composables/states";

const { $getAbsoluteUrl,  $getImage} = useNuxtApp();
import { onBeforeMount, onMounted, ref } from 'vue';
import bannerImage from '@/assets/img/placeholder.svg';

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
  },
  poster: {
    type: Object,
    required: false
  },
  lazy: {
    type: Boolean,
    required: false,
    default: false,
  }
})

const placeholder = computed(() => !props.path.data?.attributes?.placeholder ? "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAgEAACAgEDBQAAAAAAAAAAAAABAgADBgQFBxESIjFB/8QAFAEBAAAAAAAAAAAAAAAAAAAABP/EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAwDAQACEQMRAD8AsuO8a4dXj+2I+ObTe66WoG27R1O7nsHkzFepJ9k/TERBgZMV2//Z" : props.path.data.attributes.placeholder
)

const mainVideo = ref(null);
const videoSource = ref(null);
const poster = computed(() => props.poster?.data?.attributes?.url ?? bannerImage)

onMounted(async () => {
      await nextTick();
      if (document.readyState === 'complete') {
        loadVideo();
      } else {
        window.addEventListener('load', loadVideo);
      }
    });
    const loadVideo = () => {
      if (mainVideo.value && videoSource.value) {
        videoSource.value.src = $getAbsoluteUrl(props.path.data.attributes.url);
        mainVideo.value.load(); 
      }
    };

onBeforeMount(() => {
  if (videoSource.value?.src) {
    videoSource.value.src = null
  }
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
  z-index: 0;
}
.img-component.placeholder {
  filter: blur(40px);
  transform: scale(1.5);
  z-index: -1;
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
