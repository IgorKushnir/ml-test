<template>
  <transition name="slide">
    <div class="snack-bar-container" v-if="show">
      <div class="snack-bar">
        <div class="p">{{ message }}</div>
        <span class="link" v-on:click="actionHandler">{{ action }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
const emits = defineEmits(["action"])
const message = ref('Message')
const action = ref('Action')
const timeOut = ref()


const show = ref(false)

function actionHandler() {
  show.value = false
  emits('action')
}

function showSnackBar(m, a) {
  if (timeOut.value) clearTimeout(timeOut.value);

  message.value = m;
  action.value = a;
  show.value = true;

  timeOut.value = setTimeout(() => show.value = false, 4000)
}
defineExpose({ showSnackBar })

</script>

<style scoped lang="scss">
.snack-bar-container {
  position: fixed;
  width: 100%;
  z-index: 11;
  bottom: 32px;
  display: flex;
  justify-content: center;
}
.snack-bar {
  background-color: $light-gray;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 500px;
  padding: 16px;
  //* {
  //  //color: $white;
  //}
}

@include md {
  .snack-bar-container {
    bottom: 0;
  }
  .snack-bar {
    width: 100%;
    padding: 24px;
  }
}


.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease-in-out, opacity 0.5s ease;
  //transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(32px);
}
.link {
  flex: 0;
}
</style>
