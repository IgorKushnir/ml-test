<template>
  <NuxtLink v-if="false" to="/" class="nav-icon wish-icon hover">
    <div class="icon-heart-no-24">
      <div class="wish-counter">{{ counter }}</div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const counter = useFavCount()

</script>

<style scoped lang="scss">
.nav-icon .wish-counter {
  position: absolute;
  top: 2px;
  right: 0;
  font-family: $font-family;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  background-color: $red;
  color: $white;
  min-width: 16px;
  height: 16px;
  padding: 4px;
  font-size: 11px;
  border-radius: 8px;
}
@include md {

  .nav-icon.wish-icon {
    position: fixed;
    background-color: $white;
    color: $dark-blue !important;
    padding: 16px;
    border-radius: 28px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    margin: 0;
    bottom: 16px;
    right: 16px;

    .wish-counter {
      position: absolute;
      top: 0;
      right: -6px;
      font-size: 12px;
      border-radius: 10px;
      min-width: 20px;
      height: 20px;
      padding: 4px;
    }
  }

}
</style>
