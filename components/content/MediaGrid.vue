<template>
  <div class="gallery" :class="[classes, columns].join(' ')">
    <template v-for="(item, index) in data">
      <div
          :class="isLandscape(item.attributes.width, item.attributes.height) ? 'vertical' : 'horizontal'"
      >
        <div class="gallery-item" :class="isLandscape(item.attributes.width, item.attributes.height) ? 'ratio-3x4' : 'ratio-3x2'">
          <Image
              :path="{data: item}"
              :alt="data.title"
              :mime="item.attributes.mime"
          />
        </div>
      </div>
    </template>

    <slot name="end"/>
  </div>
</template>

<script setup>
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
  }
})

function isLandscape(width, height) {
  return (width / height) < 1
}

</script>

<style scoped lang="scss">
.gallery {
  display: grid;
  grid-gap: 40px;
  grid-auto-flow: dense;
}
.gallery-item {
  min-height: 100%;
}
.gallery.one {
  grid-template-columns: repeat(1, 1fr);
  .horizontal {
    grid-column: auto/span 1;
  }
}
.gallery.two, .gallery.product{
  grid-template-columns: repeat(2, 1fr);
}
.gallery.three {
  grid-template-columns: repeat(3, 1fr);
}
.gallery.four {
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
  .gallery.three {
    grid-template-columns: repeat(2, 1fr);
  }
  .gallery.four {
    grid-template-columns: repeat(3, 1fr);
  }
}
@include lg {
  .gallery.product{
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
  .gallery.two, .gallery.three, .gallery.four {
    grid-template-columns: repeat(2, 1fr);
    .horizontal {
      grid-column: auto/span 2;
    }
  }
}
</style>
