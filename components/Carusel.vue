<template>

  <transition name="fade">
    <div v-show="show" class="overflow" :class="navCompact ? 'compact' : 'full'">

      <div ref="prev" class="prev hide-md">
        <StickyBarBack reverse text=""/>
      </div>

      <div ref="next" class="next hide-md">
        <StickyBarBack text=""/>
      </div>

      <!--      <div v-for="item in data">-->
      <!--                  <pre>-->
      <!--                    {{ item.attributes.slug }}-->
      <!--                  </pre>-->
      <!--      </div>-->

      <div class="container">
        <div class="row gap-S justify-center">
          <div :class="colClass">
            <slot/>


            <div ref="swiperEl" class="swiper">
              <div class="swiper-wrapper">

                <NuxtLink
                    v-for="item in data"
                    class="swiper-slide"
                    :to="getLink(item?.attributes?.slug, item?.attributes?.type?.slug ?? item?.attributes?.type?.data?.attributes?.slug)"
                    :target="$isAbsoluteUrl(item?.attributes?.slug) ? '_blank' : '_self'"
                >
                  <div class="ratio-3x4">
                    <Image :path="item.attributes.cover_3x4" :alt="item.attributes.title"/>
                  </div>
                  <div v-if="item.attributes.title || item.attributes.text" class="m-t-16">
                    <div v-if="item.attributes.title" class="p dark-blue m-v-8"><strong>{{
                        item.attributes.title
                      }}</strong></div>
                    <div v-if="item.attributes.text" class="p m-v-8 gray">{{ item.attributes.text }}</div>
                  </div>
                </NuxtLink>

              </div>
              <div ref="swiperScrollbar" class="swiper-scrollbar m-t-40 m-t-24-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>


<script setup>
import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'

const {$isAbsoluteUrl} = useNuxtApp()

const props = defineProps({
  data: {
    type: Array || undefined,
    required: false
  },
  column: {
    type: Number,
    required: false,
    default: 6
  },
  colClass: {
    type: String,
    required: false,
    default: 'col-12'
  },
  navCompact: {
    type: Boolean,
    required: false,
    default: false
  },
  path: {
    type: String,
    required: false,
    default: '/product'
  }
})

const show = ref(false);
const swiperEl = ref()
const next = ref()
const prev = ref()
const swiperScrollbar = ref()
const localePath = useLocalePath()
const brakePoints = {
  4: [4, 4, 3.5, 3.5, 2.5],
  6: [6, 5.5, 4.5, 3.5, 2.5],
}


onMounted(() => {
  new Swiper(swiperEl.value, {
    slidesPerView: brakePoints[props.column][4],
    spaceBetween: 20,
    freeMode: true,
    mousewheel: {
      forceToAxis: true,
    },

    breakpoints: {
      480: {
        slidesPerView: brakePoints[props.column][3],
        spaceBetween: 20,
        // freeMode: true,
      },
      768: {
        slidesPerView: brakePoints[props.column][2],
        spaceBetween: 20,
        // freeMode: true,
      },
      960: {
        slidesPerView: brakePoints[props.column][1],
        spaceBetween: 20,
        // freeMode: true,
      },
      1200: {
        slidesPerView: brakePoints[props.column][0],
        spaceBetween: 40,
        // freeMode: false,
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

function getLink(slug, path) {
  if ($isAbsoluteUrl(slug)) {
    return slug
  }
  if (slug && slug.startsWith('/')) {
    return localePath(slug);
  }
  return slug ? localePath(((path ? '/'+path : props.path) + '/' + slug)) : null
}


</script>

<style scoped lang="scss">
.button-arrow {
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 16px;
  top: calc(50% - 20px);
  opacity: 0;
  transition: .5s ease-in-out opacity;
  z-index: 6;
}

.overflow {
  //overflow: hidden;
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
  z-index: 2;
  top: calc(50% - 32px)
}

.full {
  .next {
    left: auto;
    right: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);
  }

  .prev {
    left: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);
    right: auto;
  }
}

.compact {
  .next {
    left: auto;
    right: calc(100% / 8);
  }

  .prev {
    left: calc(100% / 8);
    right: auto;
  }
}

.swiper-slide:hover {

}

@media (hover: hover) {
  :deep(.img-component.base) {
    transition: .3s ease-in-out;
  }
  :deep(.m-t-16) {
    transition: 0.2s ease-in-out;
  }
  .swiper-slide:hover {

    :deep(.img-component.base) {
      transform: scale(1.1);
    }

    :deep(.m-t-16) {
      transform: translateY(-4px);
    }
  }
}


@include xl {
  .overflow {
    overflow: hidden;
  }
  .swiper {
    overflow: visible;
  }
  .compact {
    .next {
      right: -1px;
    }

    .prev {
      left: -1px;
    }
  }
}

@media (max-width: $grid-max-width) {
  .full {
    .next {
      right: -1px;
    }

    .prev {
      left: -1px;
    }
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
