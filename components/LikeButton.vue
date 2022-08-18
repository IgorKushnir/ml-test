<template>
  <div
      class="icon-like"
      :class="liked ? 'icon-heart-yes-24 active' : 'icon-heart-no-24'"
      v-on:click.prevent="handleLike"
  />
</template>

<script setup>
defineProps({
  liked: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['click'])



function handleLike() {
  emits('click')
}

</script>

<style scoped lang="scss">
.icon-like {
  font-size: 24px;
  padding: 8px;
  margin-right: -8px;
  transition: .2s ease-in-out;
  line-height: 1em;
  cursor: pointer;
}



.active{
  animation:like 0.3s 1;
}



@media (hover: hover) {
  .icon-like:hover {
    transform: scale(1.2);
  }
}

@-webkit-keyframes like {
  0%   { transform: scale(1.2); }
  80%   { transform: scale(1.6); }
  100% { transform: scale(1.2); }
}

</style>
