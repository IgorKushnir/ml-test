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
        <div class="collections  col-5  col-8-lg col-12-md p-b-0-md m-t-8-md"
          v-if="item.collections && lines?.length > 0">
          <ul class="lines__list">
            <li v-for="line in lines" class="line">
              <span class="nav-link line-item" @mouseover="lineHoverHandler(line.attributes.slug)"
                @click="lineClickHandler(line.attributes.slug)">{{ line.attributes.title }}</span>
              <Transition name="slide-fade">
                <ul v-if="currentLine?.attributes?.slug === line.attributes.slug" class="collection__list--mobile">
                  <li class="collection__item--mobile" v-for="collection in currentLine.attributes.collections.data">
                    <NuxtLink :to="localePath('/collection/' + collection.attributes.slug)"
                      @mouseover="collectionHoverHandler(collection.attributes.slug)"
                      @mouseleave="collectionHoverOutHandler" class="nav-link__forth hover">
                      {{ collection.attributes.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </Transition>
            </li>
          </ul>
          <ul v-if="currentLine" class="collection__list--desktop">
            <li v-for="collection in currentLine.attributes.collections.data">
              <NuxtLink :to="localePath('/collection/' + collection.attributes.slug)"
                @mouseover="collectionHoverHandler(collection.attributes.slug)" @mouseleave="collectionHoverOutHandler"
                class="nav-link__tertiary hover">{{ collection.attributes.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!--Submenu-->
        <ul class="sub-menu col-3 col-4-lg col-12-md m-t-8-md" v-if="item.items?.length > 0">
          <li v-if="item.items?.length > 0" v-for="sub_menu in $divideSubMenu(item.items)">
            <ul v-for="sub_item in sub_menu">
              <li>
                <NuxtLink
                    :to="localePath(sub_item.url)"
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

<script setup lang="js">
import { useRoute } from 'nuxt/app';
import Image from "~/components/Image.vue";

let currentCollection = ref(-1)
let coversList = ref([]);
const currentLine = ref(null)
const route = useRoute()

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


onMounted(() => {
const activeLine = props.lines.find((line) => line.attributes.collections.data.some(collection => collection.attributes.slug === route.params.slug) )
currentLine.value = activeLine
})


// Generate list of collections on row
const getCoversList = () => {
  let collections = [];
  props.lines?.forEach((line) => {
    line['attributes'].collections.data?.forEach(collection => {
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

// Hover on line item
function lineHoverHandler(slug) {
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 768) {
      return
    }
    currentLine.value = props.lines.find(line => line.attributes.slug === slug);
  }
}

function lineClickHandler(slug) {
    currentLine.value = currentLine.value?.attributes?.slug === slug ? null : props.lines.find(line => line.attributes.slug === slug) ;
}

</script>
<style scoped lang="scss">


a {
  color: $light-gray;
}
a:hover {
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
  margin-bottom: 12px;
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
  padding-right: calc((100% - (11 * 80px)) / 12);
  padding-left: 8px;
  position: relative;
  display: flex;
  gap: 20px;
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

.lines__list {
  min-width: 290px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.line {
  position: relative;
  break-inside: avoid;
  page-break-inside: avoid;
  cursor: pointer;
}

.line-item:after {
  content: "\e90a";
  display: none;
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  font-size: 1em;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.line-item:hover:after {
  width: min-content;
}

.fade-enter-active, .fade-leave-active {  transition: opacity 1.2s ease;
}

.line-item {
  position: relative;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;

  &:hover {
    font-weight: 700;
  }
}

.nav-link__forth {
  font-size: 12px;
  text-transform: uppercase;
}

.collection__item--mobile:not(:last-of-type) {
  margin-bottom: 20px;
}

.collection__list--mobile {
  display: none;
}

.collection__list--desktop {
  display: block;
}

@include md {
  .line-item {
    padding: 20px 0px;
    border-bottom: 1px solid $border-light;
}

  .lines__list {
    gap: 0;
    width: 100%;
}
  
.collection__list--desktop {
    display: none;
}

.collection__list--mobile {
      display: block;
      margin-left: 40px;
      width: 100%;
      padding: 20px 0;
}

.line-item {
    padding: 20px 0px;
    border-bottom: 1px solid $border-light;
  
}

.line-item:after {
      display: block;
  }

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
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
  }
  .collections:after {
    all: unset;
  }

  .wide-md {
    display: block;
  }
}
</style>
