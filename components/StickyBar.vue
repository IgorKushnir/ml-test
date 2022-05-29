<template>
  <div>
    <div ref="bar"><div class="bar" ><slot/></div></div>

    <div ref="barSticky">
      <div class="bar sticky" style="opacity: 1.5"  v-if="fixedBar"><slot/> {{$route.path}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
let bar = ref();
let barSticky = ref();
let fixedBar = ref(false);
let navigation;
const inMobile = useIsMobile();
let prevOffsetY = 0;


function scroll(e) {
  const barY = bar.value.getBoundingClientRect().y;
  // console.log('barY', bar.value.);
  // if (firstOffset === undefined) firstOffset = barY;
  // console.log(firstOffset);
  if (barY <= 0) {
    fixedBar.value = true;
  } else {
    fixedBar.value = false;
  }
  if(!inMobile.value) return


  if (barY <= 56 && barY > -100) {
    const offset = barY - 56;
    navigation.style.transform = "translate(0, "+ offset +"px)"
  }
  if (barY <= 150 && barY > 56) {
    navigation.style.transform = "translate(0, 0)"
  }

  if (barY <= 0) {
    if (prevOffsetY > barY) {
      // console.log('hide');
      // Hide Menu
      navigation.classList.remove('transform-0')
      barSticky.value.classList.remove('transform-56')
    } else {
      // console.log('show');
      // Show
      navigation.classList.add('transform-0')
      barSticky.value.classList.add('transform-56')
      bar.value.classList.add('transform-56')
    }
  }

  prevOffsetY = barY;
}


onMounted(() => {
  navigation = document.getElementsByClassName('navigation')[0];
  document.addEventListener('scroll', scroll);
});

addRouteMiddleware(async (to) => {
  document.removeEventListener("scroll", scroll);
});


</script>

<style scoped lang="scss">
.bar {
  width: 100%;
  height: 64px;
  border-width: 1px 0px;
  border-style: solid;
  border-color: $border-dark;
  background-color: $white;
}
.bar.sticky {
  position: fixed;
  top:0;
  left: 0;
  z-index:100;
}

@include md {
  .bar {
    height: 56px;
  }
}

</style>

<style>
.sticky-transition {
  transition-property: transform;
  transition: .3s;
}
/*.navigation {*/
/*  transition-property: transform;*/
/*  transition: .3s;*/
/*}*/
.transform-0 {
  transform: translate(0, 0)!important;
}
.transform-56 > * {
  transform: translate(0, 56px)!important;
  /*background-color: #eb5757!important;*/
}
</style>
