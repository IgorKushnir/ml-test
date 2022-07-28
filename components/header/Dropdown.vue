<template>
  <div class="nav-dropdown">
    <div class="container">
      <div class="row gap-L display-block-md p-v-40 p-t-32-md p-b-0-md">

        <!--Cover-->
        <div class="col-4 hide-lg">
          <div class="ratio-4x3">


            <Image :path="item.cover_4x3" size="medium" :alt="item.title"/>
            <template v-for="(cover, index) in coversList">
              <Transition name="fade">
                <Image v-if="currentCollection === index" :path="cover.cover_4x3" size="medium" :alt="cover.title"/>

              </Transition>
            </template>


          </div>
        </div>


        <!--Collections-->
        <ul class="collections  col-5  col-8-lg col-12-md p-b-0-md m-t-8-md" v-if="item.collections && lines.length > 0">
          <li v-for="line in lines" class="line">
            <span class="subheader small">{{ line.attributes.title }}</span>
            <ul>
              <li v-for="collection in line.attributes.collections.data">
                <NuxtLink
                    :to=" '/collection/' + collection.attributes.slug"
                    @mouseover="collectionHoverHandler(collection.attributes.slug)"
                    @mouseleave="collectionHoverOutHandler"
                    class="nav-link__tertiary hover"
                >{{ collection.attributes.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>

        <!--Submenu-->
        <ul class="sub-menu col-3 col-4-lg col-12-md m-t-8-md" v-if="item.items.length > 0">
          <li v-if="item.items.length > 0" v-for="sub_menu in $divideSubMenu(item.items)">
            <ul v-for="sub_item in sub_menu">
              <li>
                <NuxtLink
                    :to="sub_item.url"
                    :class="sub_item.target ? 'nav-link__secondary hover target' : 'nav-link__secondary hover'"
                    :target="sub_item.target ? '_blank' : '_self'"
                >{{ sub_item.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>

      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import Image from "~/components/Image.vue";

const {$getImage} = useNuxtApp()
let currentCollection = ref(-1)
let coversList = ref([]);

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  lines: {
    type: Array,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})




// Generate list of collections on row
const getCoversList = () => {
  let collections = [];
  props.lines.forEach((line) => {
    line['attributes'].collections.data.forEach(collection => {
      return collections.push(collection.attributes)
    });
  })

  return collections
}
coversList.value = getCoversList();

// Get Index of hover collection by slug
function getIndexOfCollectionBySlug(slug) {
  return coversList.value.findIndex(collection => {
    return slug === collection.slug
  });
}

// Hover on collection item
function collectionHoverHandler(slug) {
  currentCollection.value = getIndexOfCollectionBySlug(slug);
}
function collectionHoverOutHandler() {
  currentCollection.value = -1;
}

</script>
<style scoped lang="scss">
@import  "/assets/style/global.scss";

a {
  color: $light-gray;
}

ul {
  list-style-type: none;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
}

.sub-menu > li:first-child > ul:first-child .nav-link__secondary {
  margin-top: unset;
  padding-top: unset;
}

.sub-menu > *, .collections > * {
  //display: block;
  margin-bottom: 32px;
}

.nav-dropdown {
  position: absolute;
  left: 0;
  width: 100%;
  background-color: $dark-blue;
  border-top: 1px solid $border-light;
  margin-top: 8px;
  overflow: hidden;
}
//.nav-dropdown:after {
//  content: '';
//  position: absolute;
//  width: 400vw;
//  height: 100%;
//  left: -200px;
//  top: -1px;
//  //background-color: $dark-blue;
//  background-color: #eb5757;
//  z-index: -1;
//}

.nav-link__tertiary, .nav-link__secondary {
  padding: 8px 0;
}

.subheader.small {
  opacity: .4;
  display: block;
  margin-bottom: 12px;
}


.collections {
  column-count: 2;
  padding-right: calc((100% - (11 * 80px)) / 12);
  column-gap: 20px;
  position: relative;
}
.collections:after {
  content: '';
  position: absolute;
  top: 40px;
  right: 20px;
  width: 1px;
  height: calc(100% - 112px);
  background-color: $border-light;
}

.line {
  break-inside: avoid;
  page-break-inside: avoid;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s ease;
}

@include md {
  .nav-dropdown {
    position: relative;
    border-top: unset;
    border-bottom: 1px solid $border-light;
    margin: 0;

    .container {
      all: unset;
    }
  }

  .nav-link__tertiary, .nav-link__secondary {
    padding: 8px 0;
    margin: 8px 0;
  }


  .collections {
    column-count: 1;
    padding-right: 20px;
  }
  .collections:after {
    all: unset;
  }
}
</style>
