<template>
  <NuxtLink :to="to">
  <div class="product-item">

      <div class="product-item-head">
        <h3>{{title}}</h3>
      </div>
      <Image :path="image" :alt="title"  size="medium" :class="'image ' + ratio"/>

  </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  ratio: {
    type: String,
    required: false,
    default: 'ratio-3x4'
  },
  image: {
    type: Object,
    required: true
  }
})

</script>

<style scoped lang="scss">
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
    bottom: 0;
    padding: 24px;
    opacity: 0;
    z-index: 2;
    transition: $transition;
  }
  .image {
    //position: absolute;
    //width: 100%;
  }

  .product-item-head > *:first-child{
    margin-bottom: 8px;
  }
  .product-item-head > *:last-child {
    margin: 0;
  }
}



@media (hover: hover) {
  >>> .img-component.base {
    transition: 2.5s ease-in-out;
  }
  .product-item:hover {
    &:after {
      opacity: 1;
    }
    .product-item-head{
      opacity: 1;
    }


    >>> .img-component.base {
      transform: scale(1.1);

    }
  }
}

</style>
