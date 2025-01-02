<template>
  <div ref="gallery" class="gallery" :class="[classes, columns].join(' ')">
    <template v-for="(item, index) in data">
      <div
          v-if="!(hideFirst && index === 0)"
          :class="isLandscape(item.attributes.width, item.attributes.height) ? 'vertical' : 'horizontal'"
      >
        <div class="gallery-item" :class="isLandscape(item.attributes.width, item.attributes.height) ? 'ratio-3x4' : 'ratio-3x2'">
          <Image
              :path="{data: item}"
              :alt="alt"
              :zoom="zoom"
              :class="discontinued ? 'discontinued' : ''"
          />
        </div>
      </div>
    </template>

    <slot name="end"/>
  </div>
</template>

<script setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const props = defineProps({
  classes: {
    type: String,
    required: false,
    default: ''
  },
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: String,
    required: false,
    default: 'two'
  },
  hideFirst: {
    type: Boolean,
    required: false,
    default: false
  },
  alt: {
    type: String,
    required: false
  },
  zoom: {
    type: Boolean,
    required: false
  },
  discontinued: {
    type: Boolean,
    required: false
  },

})

const gallery = ref()

function isLandscape(width, height) {
  return (width / height) < 1
}


onMounted(() => {
if (props.zoom) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: gallery.value,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    // bgOpacity: 0.6,

    mainClass: 'pswp--custom',
    arrowPrevSVG: '<div class="button-arrow visible prev pointer-auto icon-arrow-16 white"><div class="blurq half-contrast"/></div>',
    arrowNextSVG: '<div class="button-arrow visible pointer-auto icon-arrow-16 white"><div class="blurq half-contrast"/></div>',
    closeSVG: '<div class="icon-close-24 white" style="font-size: 24px"/>',
    zoom: false,
    counter: false
    // mainClass: 'pswp--custom-icon-colors',
  });
  lightbox.init();
}
})

</script>
<style>
/*.pswp--custom-icon-colors {*/
/*  --pswp-icon-color: #00fffc;*/
/*  --pswp-icon-color-secondary: #333;*/
/*}*/
</style>
<style scoped lang="scss">


.gallery {
  display: grid;
  grid-gap: 40px;
  grid-auto-flow: dense;
}
.gallery-item {
  display: block;
  min-height: 100%;
}
.one {
  grid-template-columns: repeat(1, 1fr);
  .horizontal {
    grid-column: auto/span 1;
  }
}
.two, .product{
  grid-template-columns: repeat(2, 1fr);
}
.three {
  grid-template-columns: repeat(3, 1fr);
}
.four {
  grid-template-columns: repeat(4, 1fr);
}
.horizontal {
  grid-column: auto/span 2;
}
.vertical {
  grid-column: auto/span 1;
}



@include xl {
  .gallery {
    grid-gap: 16px;
  }
  .three {
    grid-template-columns: repeat(2, 1fr);
  }
  .four {
    grid-template-columns: repeat(3, 1fr);
  }
}
@include lg {
  .product{
    grid-template-columns: repeat(1, 1fr);
    .horizontal {
      grid-column: auto/span 1;
    }
    .vertical {
      grid-column: auto/span 1;
    }
  }
}
@include sm {
  .gallery {
    grid-template-columns: 1fr;
  }

  .horizontal {
    grid-column: auto/span 1;
  }
  .vertical {
    grid-column: auto/span 1;
  }
  .two, .three, .four {
    grid-template-columns: repeat(2, 1fr);
    .horizontal {
      grid-column: auto/span 2;
    }
  }
}


</style>
