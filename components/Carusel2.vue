<template>
  <transition name="fade">
    <div v-show="show" class="overflow">

      <div ref="prev" class="prev">
        <StickyBarBack reverse text=""/>
      </div>

      <div ref="next" class="next">
        <StickyBarBack text=""/>
      </div>

      <div class="container">
        <h2 v-if="title" class="m-t-0 m-b-40 m-b-24-md">{{ title }}</h2>
        <div ref="swiperEl" class="swiper">
          <div class="swiper-wrapper">
            <NuxtLink
                v-for="item in data"
                class="swiper-slide"
                :to="'/product/' + item.attributes.slug"
            >
              <div class="ratio-3x4">
                <Image :path="item.attributes.cover_3x4" :alt="item.attributes.title"/>
              </div>
              <p class="p-small dark-blue"><strong>{{ item.attributes.title }}</strong></p>
            </NuxtLink>
          </div>
          <div ref="swiperScrollbar" class="swiper-scrollbar m-t-40 m-t-24-md"></div>
        </div>
      </div>
    </div>
  </transition>

</template>


<script setup>
import  Swiper, { Navigation, Scrollbar, FreeMode } from 'swiper'

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

const show = ref(false);
const swiperEl = ref()
const next = ref()
const prev = ref()
const swiperScrollbar = ref()


watch(() => props.data, (d) => {
  if (d === undefined) return

  new Swiper(swiperEl.value, {
    modules: [Navigation, Scrollbar, FreeMode],
    slidesPerView: 2.5,
    spaceBetween: 20,
    freeMode: true,

    breakpoints: {
      480: {
        slidesPerView: 3.5,
        spaceBetween: 20,
        freeMode: true,
      },
      768: {
        slidesPerView: 4.5,
        spaceBetween: 20,
        freeMode: true,
      },
      960: {
        slidesPerView: 5.5,
        spaceBetween: 20,
        freeMode: true,
      },
      1200: {
        slidesPerView: 6,
        spaceBetween: 40,
        freeMode: false,
      }
    },

    navigation: {
      nextEl: next.value,
      prevEl: prev.value,
    },

    scrollbar: {
      el: swiperScrollbar.value,
      hide: false,
      draggable: true
    },



    on: {
      init: function () {
        show.value = true;
      },
    },
  });

})







</script>

<style scoped lang="scss">
.overflow {
  overflow: hidden;
  position: relative;
}
.swiper-scrollbar {
  position: relative;
  width: 100%;
  left: 0;
  height: 2px;
}
.swiper-scrollbar, .swiper-scrollbar > .swiper-scrollbar-drag {
  border-radius: 0;
  background-color: $border-dark;
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
