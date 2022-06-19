<template>
  <div v-if="data !== null" class="fact">
    <div v-if="data.logo" class="logo">
      <img src="@/assets/img/small-logo-dark.svg" alt="Milla Nova">
    </div>
    <h2 v-if="data.title">{{data.title}}</h2>
    <p v-if="data.text">{{data.text}}</p>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: false
  }
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

.logo img {
  background-image: none;
  width: 100px;
  margin: 0 auto 32px;
}

@include md {
  .logo img {
    width: 56px;
  }
}
</style>
