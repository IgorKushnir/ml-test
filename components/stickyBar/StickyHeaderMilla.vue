<template>
  <div class="wrapper">
    <div ref="wrapper" class="sticky-header-wrapper scroll-x">
      <div :class="getClass()">
        <div class="container">

          <transition name="fade">
            <div v-if="title && sticky" class="grid-column-start title-container">
              <StickyBarBack v-if="back" @click="clickHandler" reverse useCustomEmit/>
              <h3 class="sticky-title">{{ title }}</h3>

            </div>
          </transition>

          <!--          <slot></slot>-->
          <div class="grid-column-end"><slot name="end"/></div>
          <div class="grid-column-center"><slot name="center"/></div>
          <div class="grid-column-start"><slot name="start"/></div>
          <div class="grid-column-full"><slot name="full"/></div>


        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false
  },
  back: {
    type: Boolean,
    required: false,
    default: true
  }
})
const emits = defineEmits('onBackClick')

let wrapper = ref();
let sticky = ref(false);
let shift = ref(false);
const inMobile = useIsMobile();
let prevOffsetY = 0;

const clickHandler = () => {
  emits('onBackClick')
}

watch(() => sticky.value & shift.value, () => {
  const element = document.getElementsByClassName('navigation')
  if (!element) {
    return
  }
  if (sticky.value & shift.value) {
    element[0]?.classList.add('shift');
  } else {
    element[0]?.classList.remove('shift');
  }
})

function getClass() {
  if (sticky.value) {
    if (shift.value) {
      return 'sticky-header fixed shift';
    }
    return 'sticky-header fixed';
  } else {
    return 'sticky-header';
  }
}

function scroll() {
  if (!wrapper.value) return
  const originOffsetY = wrapper.value.getBoundingClientRect().y;
  const topGap = inMobile.value ? 56 : 0;

  originOffsetY < topGap ? sticky.value = true : sticky.value = false;


  sticky ? shift.value = true : shift.value = false;


  if (sticky) {
    prevOffsetY > originOffsetY ? shift.value = true : shift.value = false;
  }

  prevOffsetY = originOffsetY;
}


onMounted(() => {
  // navigation = wrapper;
  document.addEventListener('scroll', scroll, {passive: true});
});

addRouteMiddleware(async (to, from) => {
  if (to.path !== from.path) {
    document.removeEventListener("scroll", scroll);
    shift.value = false
  }
});


</script>

<style scoped lang="scss">


.title-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  max-width: 100%;
  min-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  grid-column-start: 1;
  margin-right: auto;

  //gap: 16px;
  h3 {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

}


.back-btn {
  margin-right: 32px;
}

//& > * {
//  display: inline-block;
//}

.wrapper {
  position: relative;
  height: 63px;

}

.sticky-header-wrapper {
  position: absolute;
  height: 400px;
  width: 100%;
  max-width: 100%;

  overflow: hidden;
}

.sticky-header {
  position: relative;
  top: 0;
  margin-top: -1px;
  height: 64px;
  max-height: 64px;
  width: 100%;
  //border-width: 1px 0px;
  //border-style: solid;
  //border-color: $border-dark;
  /* border-bottom: 1px solid $border-dark; */
  background-color: $white;
  z-index: 8;


}

.fixed {
  position: fixed;
}

.container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  justify-items: center;
  white-space: nowrap;
  border-bottom: 1px solid $border-dark;
}





@include md {
  .wrapper {
    height: 55px;
  }
  .sticky-header-wrapper, .sticky-header {
    height: 59px;
    max-height: 59px;
  }
  .sticky-header-wrapper {
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: $gray;
      }
  }



  .sticky-header {
    transform: translateY(0);
    transition: transform .3s ease;

    &.fixed {
      position: fixed;
      top: 56px;

      overflow-x: scroll;
      overflow-y: hidden;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        height: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: $gray;
      }
    }

    &.shift {
      transform: translateY(-56px);
    }
  }

  .container {
    grid-template-columns: auto 1fr;
  }



  .back-btn {
    margin-right: 24px;
  }

  //.title-container {
  //  margin-left: -33px;
  //}
}

</style>

<style lang="scss">


.grid-column-start {
  white-space: nowrap;
  grid-column-start: 1;
  grid-row-start: 1;
}
.grid-column-center {
  white-space: nowrap;
  grid-column-start: 2;
  grid-row-start: 1;
}
.grid-column-end {
  white-space: nowrap;
  grid-column-start: 3;
  grid-row-start: 1;
  margin-left: auto;
}
.grid-column-full {
  white-space: nowrap;
  grid-column: 1 / -1; /* This makes the child span from the first to the last column */
  margin-left: auto;
  width: 100%;

}

@include md {
  .grid-column-center {
    grid-column-start: 1;
  }
  .grid-column-end {
    grid-column-start: 2;
  }

  .sticky-header-wrapper .container {
    padding: 0 !important;
  }
}
</style>
