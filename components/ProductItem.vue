<template>
  <NuxtLink :to="to" class="product-item">
    <div class="product-item-head">
      <h3>{{title}}</h3>
      <p>dsdsdsd dfd fd fdf dfd</p>
    </div>
    <Image :path="image" :alt="title" :class="ratio"/>
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

  &:after {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: white;
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

  .product-item-head > *:first-child{
    margin-bottom: 8px;
  }
  .product-item-head > *:last-child {
    margin: 0;
  }
}


@media (hover: hover) {
  .product-item:hover {
    &:after {
      opacity: 1;
    }
    .product-item-head{
      opacity: 1;
    }
  }
}

</style>
