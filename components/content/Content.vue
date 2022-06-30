<template>
  <Container v-for="content in data" justify="content justify-center" class="m-v-120 m-v-72-xl m-v-56-md">
    <div v-if="content['__typename'] === 'ComponentContentText'" class="text-block p-t-0 p-b-0"
         :class="layout(content['text_layout'])">
      <ContentText :data="content.text"/>
    </div>

    <template v-if="content['__typename'] === 'ComponentContentImageVideoGrig'">
      <ContentMediaGrid :data="content.media.data" :classes="layout(content['grid_layout'])  + ' p-v-0'"
                        :columns="content.columns"
      />
    </template>


    <div v-if="content['__typename'] === 'ComponentContentFact'" :class="layout(content['fact_layout'])" class="p-v-0">
      <div :class="content.ratio === 'vertical' ? 'new-ratio-3x4' : 'new-ratio-16x9'">
        <Fact :data="content"/>
      </div>
    </div>


    <div v-if="content['__typename'] === 'ComponentContentMediaBanner'"
         :class="content.media_banner_layout === 'full' ? 'anti-container p-h-0' : layout(content.media_banner_layout)"
         class="p-v-0">
      <ContentBanner :data="content.banner" type="content"/>
    </div>



    <div v-if="content['__typename'] === 'ComponentContentBlocks'" :class="layout('normal')" class="p-v-0">
      <ContentBlocks :data="content.blocks"/>
    </div>

    <div v-if="content['__typename'] === 'ComponentContentCarusel'" class="anti-container">
      <Carusel
          :data="caruselData(content.carusel)"
          :column="content.column === 'six' ? 6 : 4"
          :col-class="layout(content['carusel_layout'])"
          :layout="content['carusel_layout']"
      >
        <div v-if="content.text" v-html="content.text" class="m-b-40 m-b-24-md"/>
      </Carusel>
    </div>

    <template v-if="content['__typename'] === 'ComponentContentPoster'">
      <ContentPosters :data="content.poster"/>
    </template>


    <template v-if="content['__typename'] === 'ComponentContentDivider'" >
      <div v-if="content.line" class="brake-line p-v-0"></div>
    </template>


  </Container>
</template>

<script setup>
import Posters from "./Posters";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  }
})

const layout = ((layout) => {
  if (layout === 'wide') return 'col-12';
  if (layout === 'tight') return 'col-6 col-8-xl col-10-lg col-12-sm';
  return 'col-8 col-10-xl col-12-lg'; //  === normal
})

function caruselData(data) {
  let _data = data.map(d => {
    return {
      attributes: {
        title: d.title,
        text: d.text,
        cover_3x4: d.media
      }
    };
  })
  return _data
}

</script>

<style scoped>

</style>


<style lang="scss">

.text-block {
  * {
    column-gap: 40px;
  }

  a {
    font-weight: bold;
    position: relative;
    transition: .3s;
  }

  a:after {
    transition: .3s;
    content: '';
    position: absolute;
    top: calc(100% - 1px);
    left: 0;
    width: 0;
    height: 1px;
    background-color: rgba($dark-blue, .4);
  }
}

@include md {
  .text-block {
    * {
      column-count: 1 !important;
    }
  }
}

@media (hover: hover) {
  a:hover {
    color: $dark-blue;
  }
  a:hover:after {

    width: 100%;

  }
}

blockquote {
  margin-left: 0;
  margin-right: 0;
  padding: 40px 80px;
  position: relative;

  * {
    color: $dark-blue;
  }

  background-color: $light-gray;
}

blockquote *:before {
  content: '〝';
  font-size: 2em;
  position: absolute;
  left: 0;
  top: 1em;
}

blockquote *:after {
  content: ' 〞';
  font-size: 2em;
  position: absolute;
  right: 0;
  bottom: 0.5em;
}
</style>
