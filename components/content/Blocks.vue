<template>
  <div v-for="item in data" class="blocks">
    <div class="row gap-S m-v-40 m-v-0-md">
      <div class="col-6 col-12-sm">
        <div :class="item.ratio === 'square' ? 'ratio-1x1' : ratio(item) < 1 ? 'ratio-4x3' : 'ratio-3x4'"
             :style="item.ratio === 'original' ? 'padding-bottom:' + ratio(item) * 100 + '%' : '' ">
          <Image :path="item.media"/>
        </div>
      </div>
      <div class="text-block col-6 col-12-sm" v-html="item.text"/>
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

function ratio(item) {
  return item.media.data.attributes.height / item.media.data.attributes.width
}
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

@include sm {
  .text-block {
    padding-top: 0;
  }
}

</style>
