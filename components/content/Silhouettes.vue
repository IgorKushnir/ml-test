<template>
  <div class="silhouette-container">
    <Container v-if="data.title && data.title !== ''" justify="justify-center  m-v-80 m-v-56-md">
      <div class="col-4 col-8-xl col-12-lg center p-v-0">
        <h2 class="m-v-0">{{ data.title }}</h2>
        <p v-if="data.text && data.text !== ''">{{ data.text }}</p>
      </div>
    </Container>

    <Container justify="justify-center m-b-80 m-b-56-md">
      <div class="col-8 col-10-lg col-12-md p-v-0" style="position: relative">
        <div ref="prev" class="prev hide-md">
          <StickyBarBack light reverse text=""/>
        </div>

        <div ref="next" class="next hide-md">
          <StickyBarBack light text=""/>
        </div>

        <div ref="swiperEl" class="swiper">
          <div class="swiper-wrapper">
            <NuxtLink v-for="dress in [...data.silhouettes?.data]" :to="(locale === 'en' ? '/dress/silhouettes/' : '/pl/suknie/silhouette/') + dress.attributes.slug" :key="dress.attributes.slug" class="swiper-slide">
              <div class="new-ratio-1x1">
                <NuxtImg class="silhouette" :src="`/img/silhouette/${dress.attributes.slug}.png`" :alt="dress.attributes.title" loading="lazy"/>
              </div>
              <div class="nav-link m-v-16">{{ dress.attributes.title }}</div>
            </NuxtLink>
          </div>
          <div ref="swiperScrollbar" class="swiper-scrollbar white m-t-40 m-t-56-md show-md"></div>
        </div>
      </div>
      <NuxtLink :to="locale === 'en' ?  '/dress' : '/pl/suknie'" class="button white m-t-40 show-md">{{ $t('all_dress') }}</NuxtLink>
    </Container>

  </div>
</template>

<script setup>
import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'
defineProps({
  data: {
    type: Object,
    required: true
  }
})
const swiperEl = ref();
const show = ref(false);
const next = ref()
const prev = ref()
const swiperScrollbar = ref()

const { locale } = useI18n()


onMounted(() => {
  new Swiper(swiperEl.value, {
    slidesPerView: 2.5,
    spaceBetween: 20,
    freeMode: true,
    loop: false,
    watchSlidesProgress: true,
    // centeredSlides: true,

    scrollbar: {
      el: swiperScrollbar.value,
      hide: false,
      draggable: true
    },

    mousewheel: {
      forceToAxis: true,
    },

    breakpoints: {

      768: {
        slidesPerView: 4,
        spaceBetween: 20,
        // freeMode: false,
        loop: true,
      },

      1200: {
        slidesPerView: 4,
        spaceBetween: 40,
        // freeMode: false,
        loop: true,
      }
    },


    navigation: {
      nextEl: next.value,
      prevEl: prev.value,
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

.silhouette-container {
  background-color: $gray;
  width: 100%;
  overflow: hidden;
  & * {
    color: $white;
  }
}
.silhouette {
  background-image: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nav-link {
  text-align: center;
}
.swiper {
  overflow: visible;
}
.swiper-slide{
  transition: .3s;
  opacity: .1;
}
.swiper-slide-visible {
  transition: .3s;
  opacity: 1;
}

.next, .prev {
  position: absolute;
  z-index: 10;
  top: calc(50% - 56px);
}
.next {
  right: -40px;
}
.prev {
  left: -40px;
}

.swiper-scrollbar {
  position: relative;
  width: 100%;
  left: 0;
  height: 2px;
}

.swiper-scrollbar, .swiper-scrollbar > .swiper-scrollbar-drag {
  border-radius: 0;
  background-color: rgb($border-dark, .2);
}
</style>

<style lang="scss">


.swiper-scrollbar.white {
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
    background-color: $border-dark;
    z-index: 151;

  }

  .swiper-scrollbar-drag:hover {
    &:after {
      height: 6px;
      top: 6px;
    }
  }
}

</style>
