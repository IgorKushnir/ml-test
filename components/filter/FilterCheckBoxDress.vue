<template>
  <div v-on:click="$emit('value', !filter.value) " :class="'dress-container'  + (filter.value ? ' active' : '')">
    <div class="dress">
      <img :src="'../img/silhouette/' + (filter.value ? filter.slug : filter.slug + '_s') + '.png'" width="100" height="100" :alt="filter.title">
    </div>
    <div class="p label">{{filter.title}}</div>

  </div>
</template>

<script setup>
const props = defineProps({
  filter: {
    type: Object,
    required: true
  }
})

</script>

<style scoped lang="scss">
img {
  background-image: none;
  //width: 100%;
  height: 90%;
  max-width: 100%;
  object-fit: cover;
}
.dress-container {
  cursor: pointer;
}

.active {
}

.dress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  border: 1px solid $border-dark;
  transition: .2s;

}
.active > .dress {
  background-color: $gray;
  border-color: $gray;
}

.label {
  color: $dark-blue;
  text-align: center;
}

.active > .label {
  font-weight: bold;
}

@media (hover:hover) {
  .dress-container:hover > .dress {
    background-color: $light-gray;
  }
  .dress-container.active:hover > .dress {
    background-color: $gray;
  }
}

</style>
