<template>
  <div v-if="data" class="container" :class="data?.size ??  'm-v-80 m-v-40-xl m-v-32-md'">
    <div class="row justify-center" >
      <div v-if="data['__typename'] === 'ComponentContentText'" class="text-block p-t-0 p-b-0"
           :class="layout(data['text_layout'])">
        <LazyContentText :data="data.text"/>
      </div>

      <template v-if="data['__typename'] === 'ComponentContentImageVideoGrig'">
        <LazyContentMediaGrid :data="data.media.data" :classes="layout(data['grid_layout'])  + ' p-v-0'"
                          :columns="data.columns"
        />
      </template>

      <div v-if="data['__typename'] === 'ComponentContentFact'" :class="layout(data['fact_layout'])" class="p-v-0">
        <div :class="data.ratio === 'vertical' ? 'new-ratio-3x4' : 'new-ratio-16x9'">
          <LazyFact :data="data"/>
        </div>
      </div>

      <div v-if="data['__typename'] === 'ComponentContentMediaBanner'"
           :class="data.media_banner_layout === 'full' ? 'anti-container p-h-0' : layout(data.media_banner_layout)"
           class="p-v-0">
        <LazyContentBanner :data="data.banner" type="content"/>
      </div>

      <div v-if="data['__typename'] === 'ComponentContentBlocks'" :class="layout('normal')" class="p-v-0">
        <LazyContentBlocks :data="data.blocks" :type="data.type ?? 'chess'"/>
      </div>

      <div v-if="data['__typename'] === 'ComponentContentCarusel'" class="anti-container">
        <LazyCarusel
            :data="caruselData(data.carusel)"
            :column="data.column === 'six' ? 6 : 4"
            :col-class="layout(data['carusel_layout'])"
            :layout="data['carusel_layout']"
            :nav-compact="!(data['carusel_layout'] === 'wide')"
        />
      </div>

      <template v-if="data['__typename'] === 'ComponentContentPoster'">
        <div class="row gap-S">
          <LazyContentPosters :data="data.poster"/>
        </div>
      </template>

      <template v-if="data['__typename'] === 'ComponentContentDivider'" >
        <div v-if="data.line" class="brake-line p-v-0"></div>
      </template>

      <div v-if="data['__typename'] === 'ComponentContentSilhouettes'" class="anti-container p-h-0 p-v-0">
        <ContentSilhouettes :data="data"/>
      </div>

      <div v-if="data['__typename'] === 'ComponentContentEmbedVideo'" :class="layout(data.layout ?? 'normal')" class="p-v-0">
        <LazyContentEmbed :data="data.embed"/>
      </div>

      <div v-if="data['__typename'] === 'ComponentContentLatestContent'"  class="col-12 p-v-0">
        <div class="row gap-S justify-center">
          <LazyContentLatestContent :data="data"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  data: {
    type: Object,
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
        cover_3x4: d.media,
        slug: d.link
      }
    };
  })
  return _data
}

const _data = computed(() => props.data.filter(d => d !== null))

</script>

<style scoped>

</style>


<style lang="scss">


.decrease {
  .row {
    margin: -60px 0;
    .brake-line {
      position: absolute;
    }
  }
}
.none {
  .row {
    margin: -40px 0;
    .brake-line {
      position: absolute;
    }
  }
}
@include xl {
  .decrease {
    .row {
      margin: -28px 0;
    }
  }
  .none {
    .row {
      margin: -20px 0;
    }
  }
}
@include md {
  .decrease {
    .row {
      margin: -24px 0;
    }
  }
  .none {
    .row {
      margin: -16px 0;
    }
  }
}


.content:first-child {
  margin-top: unset;
}

.text-block {
  * {
    column-gap: 40px;
  }

  a {
    font-weight: bold;
    position: relative;
    transition: .3s;
  }

  a:before {
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
