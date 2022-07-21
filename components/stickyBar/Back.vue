<template>
  <div v-if="isBackAndNoHistory"
      v-on:click="backHandler($emit)"
      :class="'back-btn' + (text ? ' text' : '') + (reverse ? ' reverse' : '') + (light ? ' light' : '')">
    <div class="back-btn-container">
      <div class="p-small hide-md"><strong>{{ text }}</strong></div>
      <div class="icon-arrow-16"></div>
    </div>
  </div>
</template>

<script setup>
const isMobile = useIsMobile()
const props = defineProps({
  text: {
    type: String,
    required: false
  },
  reverse: {
    type: Boolean,
    required: false,
    default: false,
  },
  light: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const router = useRouter()

function backHandler(e) {
  if (props.text != null) {
    e('clicks')
  } else {
    console.log(router.options?.history?.state?.back);
    router.back()
  }
}

const isBackAndNoHistory = computed(() => {
  if (props.text != null) {
    return true;
  } else {
    return router.options?.history?.state?.back && !isMobile.value
  }
})



</script>

<style scoped lang="scss">
.back-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /*height: 56px;*/
  border-width: 1px;
  border-style: solid;
  border-color: $border-dark;
  height: 64px;
  min-width: 64px;
  margin: -1px -.5px;
  background-color: $white;
}
.back-btn.light {
  background-color: unset;
  border-color: rgb($border-dark, 0);
}
.back-btn.reverse {
  margin-left: 0;
  margin-top: -1px;
  .back-btn-container {
    flex-direction: row-reverse;
    .icon-arrow-16 {
      transform: scaleX(-1);
    }
  }
}
.back-btn-container {
  display: flex;
  align-items: center;
  transition-property: transform;
  transition: .2s ease-out;
}
.back-btn.text  .back-btn-container {
  margin: 0 26px;
  * {
    margin: 0 6px;
  }
}


@media (hover: hover) {
  .back-btn:hover {
    background-color: $light-gray;
    .back-btn-container {
      transform: translate(4px , 0);
    }
  }
  .back-btn.light:hover {
    background-color: rgb($light-gray, .1);
  }
  .back-btn.reverse:hover {
    .back-btn-container {
      transform: translate(-4px , 0);
    }
  }
}

@include md {
  .back-btn-container.reverse {
    margin-left: -1px;
    margin-top: -2px;
  }
  .back-btn {
    height: 56px;
    min-width: 56px;
  }
  .back-btn.text  .back-btn-container {
    margin: 0 14px;
    * {
      margin: 0 4px;
    }
  }
}
</style>
