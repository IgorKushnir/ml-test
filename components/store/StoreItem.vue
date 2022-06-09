<template>
  <div :class="classes" v-for="store in data.store">
    <div class="store-item p-v-40 p-h-40" >
      <div class="city-container">
        <Flag :code="data.country_code"/>
        <strong>{{data.name}}</strong>
      </div>
      <h3>{{store.title}}</h3>
      <p v-if="store.description" class="p-small">{{store.description}}</p>

      <div class="contacts m-t-32">
        <ListIcon v-if="store.address" :to="'https://www.google.com/maps/place/'+store.address" :text="store.address" target="_blank" icon="location-16" class="m-v-16">
          <div class="p-small link">{{store.address}}</div>
        </ListIcon>

        <ListIcon v-if="store.phone" :to="'tel: '+store.phone" :text="store.phone" icon="phone-16" class="m-v-16">
        </ListIcon>

        <ListIcon v-if="store.website" :to="store.website" target="_blank" :text="store.website" icon="taget-16" class="m-v-16">
          <div class="p-small website link">{{store.website}}</div>

        </ListIcon>
      </div>

    </div>
  </div>

</template>

<script setup>
import Flag from "./Flag";

defineProps({
  data: {
    type: Object,
    required: true
  },
  classes: {
    type: String,
    required: true
  },
  // code: {
  //   type: Object,
  //   required: true
  // }
})






</script>

<style scoped lang="scss">
.store-item {
  border: 1px solid $border-dark;
  height: 100%;
}
.store-item > *:first-child {
  margin-top: 0;
}
.store-item > *:last-child {
  margin-bottom: 0;
}

.city-container {
  display: flex;
  height: 24px;
  align-items: center;
  & > * {
    margin-right: 8px;
  }
}

.website {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}




</style>
