<template>

  <NuxtLink :to="localePath(to)" v-if="!shimmer" class="pointer-none">


    <div class="product-item pointer-none" >
      <div v-if="gallery" ref="pagination" class="swiper-pagination"></div>
      <div v-if="gallery" ref="next" class="button-arrow pointer-auto icon-arrow-16"><div class="blur"/></div>
      <div v-if="gallery" ref="prev" class="button-arrow prev pointer-auto icon-arrow-16"><div class="blur"/></div>
        <div class="product-item-head">
          <span class="h3">{{title}}</span>
          <LikeButton class="pointer-auto" :liked="liked" :class="hideLikedDefault ? 'hide-liked-default' : ''" @click="handleLike(id)"/>
        </div>
        <Image v-if="!gallery" :path="image" :alt="productType ? title + ' ' + productType : title"  size="medium" :class="'image ' + ratio"/>


      <div ref="swiperEl" class="swiper swiper-product pointer-auto">
        <div class="swiper-wrapper" v-if="gallery">
          <Image class="swiper-slide" :path="image" :alt="productType ? title + ' ' + productType : title"  size="medium" :class="'image ' + ratio"/>
          <template v-for="_image in gallery?.data ?? []">
            <Image v-if="(image.data.attributes.url !== _image.attributes.url) && _image.attributes.mime.startsWith('image')" class="swiper-slide"  :path="{data: _image}" :alt="productType ? title + ' ' + productType : title"  size="medium" :class="'image ' + ratio"/>
          </template>
        </div>
      </div>



<!--      {{image}}-->
<!--      {{gallery.data}}-->
    </div>
  </NuxtLink>
  <div v-else class="shimmer ratio-3x4"></div>
</template>

<script setup>
import '~/assets/js/swiper/swiper-bundle.min.css';
import Swiper from '~/assets/js/swiper/swiper-bundle.esm.browser.min.js'

const props = defineProps({
  id: {
    type: String,
    required: false
  },
  likeList: {
    type: Array,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  productType: {
    type: String,
    required: false
  },
  to: {
    type: String,
    required: false
  },
  ratio: {
    type: String,
    required: false,
    default: 'ratio-3x4'
  },
  image: {
    type: Object,
    required: false
  },
  gallery: {
    type: Object,
    required: false,
  },
  hideLikedDefault: {
    type: Boolean,
    required: false,
    default: false
  },
  shimmer: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emits = defineEmits(['updateLikes'])
const { $toggleLikeProduct } = useNuxtApp()

const liked = computed(() => props.likeList?.includes(props.id.toString()))



function handleLike(id) {
  liked.value = $toggleLikeProduct(id)
  emits('updateLikes', id)
}
const swiperEl = ref()
const pagination = ref()
const next = ref()
const prev = ref()

onMounted(() => {
  if (swiperEl.value !== null) {
    new Swiper(swiperEl.value, {
      spaceBetween: 1,
      loop: true,
      navigation: {
        nextEl: next.value,
        prevEl: prev.value,
      },
      pagination: {
        el: pagination.value,
      }
    })

  }

})
</script>

<style scoped lang="scss">
.relative {
  position: relative;
}
.shimmer {
  -webkit-mask:linear-gradient(-60deg,#000 40%,#0001,#000 60%) right/400% 100%;
  animation: shimmer 2s infinite;
  //background-color: $gray;
  background-color: $light-gray;
}

@keyframes shimmer {
  100% {-webkit-mask-position:left}
}

$transition: .5s ease-in-out;
.product-item {

  position: relative;
  width: 100%;
  height: 100%;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient(180deg, rgba($white, 0) 75%, rgba($white, .8) 100%);
    opacity: 0;
    transition: $transition;
  }

  .product-item-head {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 0;
    padding: 24px;
    z-index: 2;
    transition: $transition;
  }
  .h3 {
    opacity: 0;
    transition: $transition;
  }

  .icon-like {
    margin-right: -8px!important;
  }
  .icon-heart-no-24 {
    opacity: 0;
  }

  .hide-liked-default.icon-heart-yes-24 {
    opacity: 0;
  }




  .product-item-head > *:first-child{
    margin-bottom: 8px;
  }
  .product-item-head > *:last-child {
    margin: 0;
  }
}
//.product-item:focus {
//  opacity: .1;
//}

@include md {

  .product-item .product-item-head {
    padding: 16px 24px;
  }
  //.product-item-head .h3 {
  //  opacity: 1;
  //}
  //
  //
  //.hide-liked-default.icon-heart-yes-24,
  //.product-item-head .icon-heart-no-24,
  //.product-item-head .icon-heart-yes-24 {
  //  opacity: 1!important;
  //}


  .icon-like {
    padding-top: 16px;
  }
}



//@media (hover: hover) {
  :deep(.img-component.base) {
    transition: 0.5s ease-in-out;
  }
  .product-item:hover, .button-arrow:hover > .product-item  {
    &:after {
      opacity: 1;
    }



    :deep(.swiper-pagination),
    .product-item-head .h3,
    .product-item-head .icon-heart-no-24,
    .product-item-head .icon-heart-yes-24 {
      opacity: 1;
    }


    @media (hover: hover) {
      :deep(.img-component.base) {
        transform: scale(1.1);
      }
      .button-arrow {
        opacity: 1;
      }
    }


  }
//}



.button-arrow {
  position: absolute;
  width: 40px;
  height: 40px;
  //background-color: $white;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 16px;
  top: calc(50% - 20px);
  opacity: 0;
  transition: $transition opacity;
  z-index: 6;
}

.button-arrow:hover .blur{
  //background-color: $light-gray;
  filter: blur(10px);
}
.button-arrow.prev {
  transform: scale(-1);
  right: unset;
  left: 16px;

}
.button-arrow .blur {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: $white;
  filter: blur(15px);
  border-radius: 50%;
}
//.button-arrow:after {
//  background-color: #00dc82;
//  position: absolute;
//  width: 100%;
//  height: 100%;
//  filter: blur(1px);
//  z-index: 0;
//}
:deep(.swiper-pagination) {
  z-index: 6;
  //text-align: left;
  //padding-left: 22px;
  opacity: 0;
  transition: opacity $transition;
}
//@include md {
//  :deep(.swiper-pagination) {
//    opacity: 1;
//    bottom: -18px;
//    //text-align: center;
//    //padding-left: unset;
//
//  }
//}
:deep(.swiper-pagination-bullet) {
  width: 4px;
  height: 4px;
}
:deep(.swiper-pagination-bullet-active) {
  background-color: black;
}
</style>
