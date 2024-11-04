<template>
  <div v-if="data" class="banner" :class=" type === 'content' ? 'ratio-16x9  ratio-3x4-md' : type === 'banner' ? 'ratio-banner' : 'ratio-main-screen'">

    <Image class="hide-md" v-if="viewport.isGreaterThan('sm')" size="large" :path="data.cover_4x3" :alt="(!data.title || data.title === '') ? title : data.title" :poster="data?.poster_4x3" />
    <Image class="show-md" v-else :path="data.cover_3x4.data ? data.cover_3x4 : data.cover_4x3" :alt="(!data.title || data.title === '') ? title : data.title" :poster="data?.poster_3x4 ? data.poster_3x4 : data?.poster_4x3" />
    <div class="overlay" />
    <div class="wrapper" :class="type">
      <Container :justify="(type === 'main' || type === 'banner') ? '' : 'justify-center'">

        <div  :class="(type === 'main' || type === 'banner') ? 'col-4 col-6-lg col-12-md p-v-0' : 'col-6 col-10-lg col-12-md p-v-0 center'">
          <div class="h1 white" :class="type === 'main' ? '' : (type === 'content' || type === 'banner') ? 'h2' : 'title'">{{(!data.title || data.title === '') ? title : data.title}}</div>
          <p v-if="data.text" class="white">{{(!data.text || data.text === '') ? text : data.text}}</p>

          <NuxtLink v-if="data.button" :to="data.button_link" class="button white m-v-32">{{ data.button_text }}</NuxtLink>
          <div v-if="!data.button && type === 'inner'" class="arrow-down icon-arrow-16 white m-t-56 m-t-32-md m-b-32"/>
        </div>
      </Container>
    </div>

  </div>
</template>

<script setup>
import Container from "../Container";
const viewport = useViewport()

const props = defineProps({
  data: {
    type: Object,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false,
    default: "inner"
  }
})
// const _media = computed(() => {
//   const keys = Object.keys(props.data);
//   const index = keys.findIndex(d => d.endsWith('media'))
//   return props.data[keys[index]]
// })

</script>

<style scoped lang="scss">


.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
.wrapper.content {
  align-items: center;
//  &:last-child {
//  margin-bottom: 0;
//}
}


.overlay {
  background-color: $overlay;
}

.arrow-down {
  border-radius: 50%;
  transform: rotate(90deg);
}

.ratio-banner {
  height: 0;
  padding-bottom: 420px;
  position: relative;
  & > * {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }
}
@include md {
  .ratio-banner {
    padding-bottom: 100%;
  }
}
</style>
