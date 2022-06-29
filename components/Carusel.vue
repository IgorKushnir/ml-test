<template>
  <transition name="fade">
    <div v-show="show" class="overflow" :class="navCompact ? 'compact' : 'full'">

      <div ref="prev" class="prev">
        <StickyBarBack reverse text=""/>
      </div>

      <div ref="next" class="next">
        <StickyBarBack text=""/>
      </div>

      <div class="container">
        <div class="row gap-S justify-center">
          <div :class="colClass">
            <slot/>
            <div ref="swiperEl" class="swiper">
              <div class="swiper-wrapper">
                <NuxtLink
                    v-for="item in data"
                    class="swiper-slide"
                    :to="item.attributes.slug ? (path +'/' + item.attributes.slug) : null"
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
import '~/assets/js/swiper/swiper-bundle.min.css';

import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'


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

const brakePoints = {
  4: [4, 4, 3.5, 3.5, 2.5],
  6: [6, 5.5, 4.5, 3.5, 2.5],
}


onMounted(() => {
  new Swiper(swiperEl.value, {
    slidesPerView: brakePoints[props.column][4],
    spaceBetween: 20,
    freeMode: true,

    breakpoints: {
      480: {
        slidesPerView: brakePoints[props.column][3],
        spaceBetween: 20,
        freeMode: true,
      },
      768: {
        slidesPerView: brakePoints[props.column][2],
        spaceBetween: 20,
        freeMode: true,
      },
      960: {
        slidesPerView: brakePoints[props.column][1],
        spaceBetween: 20,
        freeMode: true,
      },
      1200: {
        slidesPerView: brakePoints[props.column][0],
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



@include md {
  .next, .prev {
    display: none;
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

<!--<template>-->
<!--  <transition name="fade">-->

<!--    <div v-show="show" class="swiper-wrapper"  :class="layout">-->
<!--      <div ref="prev" class="prev">-->
<!--        <StickyBarBack reverse text=""/>-->
<!--      </div>-->

<!--      <div ref="next" class="next">-->
<!--        <StickyBarBack text=""/>-->
<!--      </div>-->
<!--      <div  class="overflow">-->
<!--        <div class="row gap-S justify-center">-->
<!--          <div :class="colClass">-->
<!--            <slot/>-->

<!--            <div ref="swiperEl" class="swiper">-->
<!--              <div class="swiper-wrapper">-->
<!--                <NuxtLink-->
<!--                    v-for="item in data"-->
<!--                    class="swiper-slide"-->
<!--                    :to="item.attributes.slug ? (path +'/' + item.attributes.slug) : null"-->

<!--                >-->
<!--                  <div class="ratio-3x4">-->
<!--                    <Image :path="item.attributes.cover_3x4" :alt="item.attributes.title"/>-->
<!--                  </div>-->

<!--                  <div v-if="item.attributes.title || item.attributes.text" class="m-t-16">-->
<!--                    <div v-if="item.attributes.title" class="p dark-blue m-v-8"><strong>{{-->
<!--                        item.attributes.title-->
<!--                      }}</strong></div>-->
<!--                    <div v-if="item.attributes.text" class="p m-v-8 gray">{{ item.attributes.text }}</div>-->
<!--                  </div>-->

<!--                </NuxtLink>-->
<!--              </div>-->
<!--              <div ref="swiperScrollbar" class="swiper-scrollbar m-t-40 m-t-24-md"></div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--  </transition>-->

<!--</template>-->


<!--<script setup>-->
<!--import '~/assets/js/swiper/swiper-bundle.min.css';-->

<!--import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'-->


<!--const props = defineProps({-->
<!--  data: {-->
<!--    type: Array || undefined,-->
<!--    required: false-->
<!--  },-->
<!--  column: {-->
<!--    type: Number,-->
<!--    required: false,-->
<!--    default: 6-->
<!--  },-->
<!--  colClass: {-->
<!--    type: String,-->
<!--    required: false,-->
<!--    default: 'col-12'-->
<!--  },-->
<!--  layout: {-->
<!--    type: String,-->
<!--    required: false,-->
<!--    default: 'wide'-->
<!--  },-->
<!--  path: {-->
<!--    type: String,-->
<!--    required: false,-->
<!--    default: '/product'-->
<!--  },-->
<!--})-->

<!--const show = ref(false);-->
<!--const swiperEl = ref()-->
<!--const next = ref()-->
<!--const prev = ref()-->
<!--const swiperScrollbar = ref()-->

<!--const brakePoints = {-->
<!--  4: [4, 4, 3.5, 3.5, 2.5],-->
<!--  6: [6, 5.5, 4.5, 3.5, 2.5],-->
<!--}-->


<!--onMounted(() => {-->
<!--  new Swiper(swiperEl.value, {-->
<!--    slidesPerView: brakePoints[props.column][4],-->
<!--    spaceBetween: 20,-->
<!--    freeMode: true,-->

<!--    breakpoints: {-->
<!--      480: {-->
<!--        slidesPerView: brakePoints[props.column][3],-->
<!--        spaceBetween: 20,-->
<!--        freeMode: true,-->
<!--      },-->
<!--      768: {-->
<!--        slidesPerView: brakePoints[props.column][2],-->
<!--        spaceBetween: 20,-->
<!--        freeMode: true,-->
<!--      },-->
<!--      960: {-->
<!--        slidesPerView: brakePoints[props.column][1],-->
<!--        spaceBetween: 20,-->
<!--        freeMode: true,-->
<!--      },-->
<!--      1200: {-->
<!--        slidesPerView: brakePoints[props.column][0],-->
<!--        spaceBetween: 40,-->
<!--        freeMode: false,-->
<!--      }-->
<!--    },-->

<!--    navigation: {-->
<!--      nextEl: next.value,-->
<!--      prevEl: prev.value,-->
<!--    },-->

<!--    scrollbar: {-->
<!--      el: swiperScrollbar.value,-->
<!--      hide: false,-->
<!--      draggable: true-->
<!--    },-->


<!--    on: {-->
<!--      init: function () {-->
<!--        show.value = true;-->
<!--      },-->
<!--    },-->
<!--  });-->
<!--})-->


<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.swiper-wrapper {-->
<!--  width: 100%;-->
<!--  max-width: 100%;-->
<!--}-->
<!--.overflow {-->
<!--  overflow: hidden;-->
<!--  position: relative;-->
<!--}-->

<!--.swiper-scrollbar {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  left: 0;-->
<!--  height: 2px;-->
<!--}-->

<!--.swiper-scrollbar, .swiper-scrollbar > .swiper-scrollbar-drag {-->
<!--  border-radius: 0;-->
<!--  background-color: $border-dark;-->
<!--}-->


<!--.next, .prev {-->
<!--  position: absolute;-->
<!--  z-index: 2;-->
<!--  top: calc(50% - 32px)-->
<!--}-->

<!--.swiper-button-disabled {-->
<!--  opacity: .3;-->
<!--}-->

<!--.next {-->

<!--  left: auto;-->
<!--  right: -100px;-->
<!--}-->

<!--.prev {-->
<!--  left: -100px;-->
<!--  right: auto;-->
<!--}-->

<!--//.wide {-->
<!--//  .next {-->
<!--//-->
<!--//    left: auto;-->
<!--//    //right: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);-->
<!--//    right: -100px;-->
<!--//  }-->
<!--//-->
<!--//  .prev {-->
<!--//    //left: calc((((100% - $grid-max-width) / 2) + 40px) / 2 - 32px);-->
<!--//    left: -100px;-->
<!--//    right: auto;-->
<!--//  }-->
<!--//}-->

<!--//.normal {-->
<!--//  .next {-->
<!--//    left: auto;-->
<!--//    right: calc(100% / 8);-->
<!--//  }-->
<!--//-->
<!--//  .prev {-->
<!--//    left: calc(100% / 8);-->
<!--//    right: auto;-->
<!--//  }-->
<!--//}-->


<!--@include md {-->
<!--  .next, .prev {-->
<!--    display: none;-->
<!--  }-->
<!--}-->

<!--@include xl {-->

<!--  .swiper {-->
<!--    overflow: visible;-->
<!--  }-->


<!--  .normal {-->
<!--    .next {-->
<!--      right: -41px;-->
<!--    }-->

<!--    .prev {-->
<!--      left: -41px;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--@media (max-width: $grid-max-width) {-->
<!--  .wide {-->
<!--    .next {-->
<!--      right: -41px;-->
<!--    }-->

<!--    .prev {-->
<!--      left: -41px;-->
<!--    }-->
<!--  }-->

<!--}-->
<!--</style>-->

<!--<style lang="scss">-->
<!--.swiper-scrollbar-drag {-->
<!--  border-radius: 0;-->
<!--  height: 20px;-->
<!--  top: -10px;-->
<!--  cursor: move;-->
<!--  background-color: unset;-->
<!--}-->

<!--.swiper-scrollbar-drag:after {-->
<!--  transition: .15s ease-in-out;-->
<!--  content: '';-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 2px;-->
<!--  top: 10px;-->
<!--  background-color: $dark-blue;-->
<!--  z-index: 151;-->

<!--}-->

<!--.swiper-scrollbar-drag:hover {-->
<!--  &:after {-->
<!--    height: 6px;-->
<!--    top: 6px;-->
<!--  }-->
<!--}-->
<!--</style>-->
