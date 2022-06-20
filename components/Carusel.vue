<template>

  <div class="overflow">
    <StickyBarBack reverse v-on:click="prev" class="prev" text=""/>

    <StickyBarBack v-on:click="next"  class="next" text=""/>

    <div class="container">
      <h2 v-if="title" class="m-t-0 m-b-40 m-b-24-md">{{ title }}</h2>

      <swiper
          :modules="[Navigation, Scrollbar, FreeMode]"
          :slides-per-view="6"
          :space-between="40"
          :scrollbar="{ draggable: true }"
          @swiper="onSwiper"
      >
        <swiper-slide  v-for="item in data">
          <NuxtLink
              class="swiper-slide"
              :to="'/product/' + item.attributes.slug"
          >
            <div class="ratio-3x4">
              <Image :path="item.attributes.cover_3x4" :alt="item.attributes.title"/>
            </div>
            <p class="p-small dark-blue"><strong>{{ item.attributes.title }}</strong></p>
          </NuxtLink>
        </swiper-slide>
      </swiper>
    </div>
  </div>

</template>


<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';

import { Navigation, Scrollbar, FreeMode} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';


const props = defineProps({
  data: {
    type: Array || undefined,
    required: false
  },
  title: {
    type: String,
    required: false
  }
})

const carusel = ref();

function onSwiper(s) {
  carusel.value = s;
}
function prev() {
  carusel.value.slidePrev()
}
function next() {
  carusel.value.slideNext()
}

</script>

<style scoped lang="scss">
.overflow {
  overflow: hidden;
  position: relative;
}




.next, .prev {
  position: absolute;
  z-index: 8;
  top: calc(50% - 32px)
}

.next {
  left: auto;
  right: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);
}

.prev {
  left: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);
  right: auto;
}

@include md {
  .next, .prev {
    display: none;
  }
}

@include xl {
  .swiper {
    overflow: visible;
  }
}

@media (max-width: $grid-max-width) {
  .next {
    right: -1px;
  }
  .prev {
    left: -1px;
  }
}
</style>

<style lang="scss">
.swiper-scrollbar {
  position: relative;
  width: 100%;
  left: 0;
  height: 2px;
}

.swiper-scrollbar{
  border-radius: 0;
  background-color: $border-dark;
}

.swiper-scrollbar-drag {
  border-radius: 0;
  height: 20px;
  top: -10px;
  cursor: move;
  background-color: unset;
}

.swiper-scrollbar-drag:after {
  transition: .15s ease-in-out;
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  top: 10px;
  background-color: $dark-blue;
  z-index: 151;

}

.swiper-scrollbar-drag:hover {
  &:after {
    height: 6px;
    top: 6px;
  }
}
</style>
