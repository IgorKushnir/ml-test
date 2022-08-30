<template>
  <div class="ratio-3x4" :class="poster ? 'ratio-4x3 ratio-3x4-md' : ''">

    <NuxtLink :to="to"
              v-on:mouseenter="hover(true, $el)" v-on:mouseleave="hover(false, $el)"
              class="collection-item"
    >
      <template v-if="!(poster && image_4x3)">
        <Image :path="image" :alt="title"  size="medium"/>
      </template>

      <template v-else>
        <Image class="hide-md" :path="image_4x3" :alt="title"  size="medium"/>
        <Image class="show-md" :path="image" :alt="title"  size="medium"/>
      </template>



      <div class="collection-item-head" :class="poster ? 'gradient' : ''">
        <div class="collection-content p-v-56 p-h-56 p-v-32-md p-h-16-md">
          <p class="subheader">{{subHeader}}</p>
          <h2>{{title}}</h2>
          <p v-if="text">{{ text }}</p>

          <div class="p-v-16">
            <div class="button white">{{ button_text }}</div>
          </div>
        </div>

      </div>


    </NuxtLink>
  </div>

</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: false
  },
  subHeader: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  image: {
    type: Object,
    required: true
  },
  button_text: {
    type: String,
    required: false,
    default: 'Explore'
  },
  poster: {
    type: Boolean,
    required: false,
    default: false
  },
  image_4x3: {
    type: Object,
    required: false
  },
})

function hover(hover, el) {
  const button = el.getElementsByClassName('button')[0]
  if (hover) {
    button.classList.add('button-hover')
  } else {
    button.classList.remove('button-hover')
  }
}
</script>

<style scoped lang="scss">


.collection-item > * {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.collection-item-head {
  background-color: $overlay;
  text-align: center;
  *{
    color: $white;
  }
}
.collection-item-head.gradient {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .6) 100%);
}

.collection-content {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.poster {
  //max-height: 500px;
}

//@media (hover: hover) {
//  .btn-ctn {
//    transition: .3s;
//  }
//  .collection-item:hover {
//    .btn-ctn {
//      padding-top: 100px;
//    }
//
//  }
//}

</style>
