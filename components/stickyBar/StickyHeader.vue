<template>
  <div ref="wrapper" class="sticky-header-wrapper">
    <div :class="getClass()">
      <slot/>
    </div>
  </div>
</template>

<script setup>
let wrapper = ref();
let sticky = ref(false);
let shift = ref(false);
const inMobile = useIsMobile();
let prevOffsetY = 0;

watch(() => sticky.value & shift.value, () => {
  if (sticky.value & shift.value) {
    document.getElementsByClassName('navigation')[0].classList.add('shift');
  } else {
    document.getElementsByClassName('navigation')[0].classList.remove('shift');
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
  document.addEventListener('scroll', scroll);
});

addRouteMiddleware(async (to, from) => {
  if (to.path !== from.path) {
    document.removeEventListener("scroll", scroll);
  }
});
</script>

<style scoped lang="scss">
.sticky-header-wrapper {
  position: relative;
  height: 64px;
  max-height: 64px;
  width: 100%;
}
.sticky-header {
  position: relative;
  top: 0;
  margin-top: -1px;
  height: 64px;
  max-height: 64px;
  width: 100%;
  border-width: 1px 0px;
  border-style: solid;
  border-color: $border-dark;
  background-color: $white;
  z-index: 8;
}
.fixed {
  position: fixed;
}


@include md {
  .sticky-header-wrapper, .sticky-header {
    height: 56px;
    max-height: 56px;
  }

  .sticky-header {
    transform: translateY(0);
    transition: transform .3s ease;
    &.fixed {
      position: fixed;
      top: 56px;
    }
    &.shift {
      transform: translateY(-56px);
    }
  }
}

</style>
