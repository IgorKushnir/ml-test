<template>
  <div class="fact">
    <h2 v-if="title">{{title}}</h2>
    <p v-if="text">{{text}}}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: false
  },
  logo: {
    type: Boolean,
    required: false,
    default: false
  },
})
</script>

<style scoped lang="scss">
.fact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: $pink;
  text-align: center;
  padding: 40px;
  * {
    max-width: 400px;
    margin-top: unset;
  }
}
</style>
