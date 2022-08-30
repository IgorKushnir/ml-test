<template>

  <Container>
    <div class="col-6 hide-lg">
      <div class="ratio-1x1">
        <Image :path="data.cover_1x1" :alt="data.title"/>
      </div>
    </div>
    <div class="col-6 col-12-lg">
      <div class="new-ratio-1x1">
        <div class="contact">
          <h1 class="title">{{ data.title }}</h1>
          <p class="m-t-0">{{data.text}}</p>
          <div v-if="data.entry.length > 0" class="navs m-v-32 m-v-0-lg">
            <NavButton v-for="item in data.entry" :to="'?' + item.slug" :title="item.title"/>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})

</script>

<style scoped lang="scss">


.contact {
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  * {
    max-width: 400px;
  }
  .navs {
    width: 100%;
  }
}
@include lg {
  .new-ratio-1x1 {
    aspect-ratio: unset;
  }
}

</style>
