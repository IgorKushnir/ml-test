<template>
  <div class="container tag-container">
    <div class="row">
      <div class="toggle-container">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">

.toggle-container {
  position: absolute;
  top: 23px;
  right: 0;
  display: flex;
  .label {
    margin-right: 16px;
    margin-top: 6px;
  }
}

@include xl {
  .tag-container {
    height: 32px;
  }
}
</style>
