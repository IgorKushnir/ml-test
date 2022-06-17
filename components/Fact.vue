<template>
  <div class="fact">
    <div v-if="logo" class="logo">
      <img src="@/assets/img/small-logo-dark.svg" alt="Milla Nova">
    </div>
    <h2 v-if="title">{{title}}</h2>
    <p v-if="text">{{text}}</p>
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
