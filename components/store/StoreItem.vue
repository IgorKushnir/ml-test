<template>
  <div>
    <div class="store-item p-v-40 p-h-40" >
      <div class="city-container">
        <Flag :code="store.country_code"/>
        <strong>{{store.city}}</strong>
      </div>
      <h3>{{store.title}}</h3>
      <p v-if="store.description" class="p-small">{{store.description}}</p>

      <div class="contacts m-t-32">
        <ListIcon v-if="store.address" :to="'https://www.google.com/maps/place/'+store.address"  target="_blank" icon="location-16" class="m-v-16">
          {{ store.address }}
          <div class="display-block m-t-8">
            <div class="p-small link" style="display: inline-block">Show on map <span class="icon-taget-16"/></div>
          </div>
        </ListIcon>

        <ListIcon v-if="store.phone" :to="'tel: '+store.phone" icon="phone-16" class="m-v-16">
          <div class="p-small link">{{store.phone}}</div>
        </ListIcon>

        <ListIcon v-if="store.website" :to="store.website" target="_blank" :text="store.website" icon="taget-16" class="m-v-16">
          <div class="p-small link">{{store.website}}</div>
        </ListIcon>

        <template v-if="store.lines.data.length > 0">
          <div class="subheader small m-t-32">Lines</div>
          <p  class="p-small" >{{store.lines.data.map(line => line.attributes.title).join(', ')   }}</p>
        </template>

      </div>

    </div>
  </div>

</template>

<script setup>
import Flag from "./Flag";

defineProps({
  store: {
    type: Object,
    required: true
  }
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






</style>
