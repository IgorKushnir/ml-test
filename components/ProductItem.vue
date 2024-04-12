<template>
  <NuxtLink :to="localePath(to)" v-if="!shimmer">
    <div class="product-item" >
        <div class="product-item-head">
          <span class="h3">{{title}}</span>
          <LikeButton :liked="liked" :class="hideLikedDefault ? 'hide-liked-default' : ''" @click="handleLike(id)"/>
        </div>
        <Image :path="image" :alt="productType ? title + ' ' + productType : title"  size="medium" :class="'image ' + ratio"/>

    </div>
  </NuxtLink>
  <div v-else class="shimmer ratio-3x4"></div>
</template>

<script setup>
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
</script>

<style scoped lang="scss">

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
    transition: 2.5s ease-in-out;
  }
  .product-item:hover  {
    &:after {
      opacity: 1;
    }

    .product-item-head .h3,
    .product-item-head .icon-heart-no-24,
    .product-item-head .icon-heart-yes-24 {
      opacity: 1;
    }

    @media (hover: hover) {
      :deep(.img-component.base) {
        transform: scale(1.1);
      }
    }


  }
//}

</style>
