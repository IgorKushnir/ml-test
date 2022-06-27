<template>
  <div v-for="item in data" class="blocks">
    <div class="row gap-S m-v-80">
      <div class="col-6">
        <div class="ratio-1x1">
          <Image :path="item.media"/>
        </div>
      </div>
      <div class="text-block col-6" v-html="item.text"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<style scoped lang="scss">
.blocks:first-child .row {
  margin-top: 0!important;
}
.blocks:last-child .row {
  margin-bottom: 0!important;
}
.blocks:nth-child(2n){
  .row {
    flex-direction: row-reverse;
  }
}
.text-block *:first-child {
  margin-top: 0;
}

</style>
