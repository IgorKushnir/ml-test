<template>
  <div class="promo-container" :class="'light_bg dark_blue'">
    <div class="logo"><Logo/></div>
    <div class="center-md">
      <div class="subheader">NEWSLETTER</div>
      <h2>THE LATEST NEWS FROM Millanova</h2>
      <p>Be the first to learn about Milla Nova latest collections, store openings, and events.</p>
    </div>
    <div class="button primary">dfdfd</div>
  </div>
</template>

<script setup>

import Logo from "./Logo";
</script>

<style scoped lang="scss">
.logo {
  height: 100px;
}
.promo-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

</style>
