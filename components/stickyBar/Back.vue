<template>
  <div v-on:click="backHandler($emit)"
      :class="'back-btn' + (text ? ' text' : '') + (reverse ? ' reverse' : '') ">
    <div class="back-btn-container">
      <div class="p-small"><strong>{{ text }}</strong></div>
      <div class="icon-arrow-16"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: false
  },
  reverse: {
    type: Boolean,
    required: false,
    default: false,
  }
})
const router = useRouter()

function backHandler(e) {
  if (props.text != null) {
    e('clicks', 'hello')
  } else {
    router.back()
  }
}
</script>

<style scoped lang="scss">
.back-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /*height: 56px;*/
  border-width: 0 1px;
  border-style: solid;
  border-color: $border-dark;
  height: 63px;
  min-width: 64px;
  margin: -.5px;
}
.back-btn.reverse {
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
  .back-btn.reverse:hover {
    .back-btn-container {
      transform: translate(-4px , 0);
    }
  }
}

@include md {
  .back-btn {
    height: 55px;
  }
  .back-btn.text  .back-btn-container {
    margin: 0 14px;
    * {
      margin: 0 4px;
    }
  }
}
</style>
