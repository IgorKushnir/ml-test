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


.tag-container {
  height: auto;
  min-height: 32px;
  margin-bottom: -76px!important;
  margin-top: 24px!important;
  z-index: 1;
  .row {
    justify-content: flex-end;
  }
}
@include xl {
  .tag-container {
    margin-top: 16px!important;
    margin-bottom: -44px!important;
  }
}

.toggle-container {
  gap: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  .label {
    margin-right: 16px;
    margin-top: 6px;
  }
}


//@include xl {
//  .tag-container {
//    height: 32px;
//  }
//}
</style>
