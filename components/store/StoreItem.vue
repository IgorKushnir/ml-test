<template>
  <div>
    <div class="store-item p-v-40 p-h-40" >
      <div class="city-header">
        <div class="city-container">
          <Flag :code="store.country_code"/>
          <strong v-if="!country">{{store.city}}</strong>
          <h3 v-if="country" style="text-transform: unset">{{store.city}}</h3>
        </div>
      </div>

      <h3 v-if="store.title" class="store-title">{{store.title}}</h3>
      <div v-if="!country && store.premium" class="premium-badge">
        <img src="@/assets/img/premium-star.svg" width="24" height="24" alt="Premium client">
      </div>
      <p v-if="store.description" class="p-small">{{store.description}}</p>

      <div v-if="store.address || store.phone || store.website || store?.lines?.data.length > 0" class="contacts m-t-32">
        <ListIcon v-if="store.address" :to="'https://www.google.com/maps/place/'+store.address"  target="_blank"  icon="location-16" class="m-v-16">
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

        <template v-if="store?.lines?.data.length > 0">
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
  },
  country: {
    type: Boolean,
    required: false,
    default: false
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
.city-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.store-title {
  display: inline-block;
  margin-bottom: 0;
}
.premium-badge {
  height: 1em;
  display: inline-block;
  position: relative;
}
.premium-badge img {
  background: unset;
  height: 1.4em;
  margin-top: -0.2em;
  margin-left: 8px;
  position: relative;
  z-index: 10;
}


@media (hover: hover) {
  .premium-badge:hover:after  {
    opacity: 1;
  }
  .premium-badge:after {
    content: 'Recommended boutique with a wide selection of Milla Nova dresses';
    font-size: 14px;
    background-color: $dark-blue;
    color: $white;
    width: 160px;
    position: absolute;
    padding: 40px 8px 8px 8px;
    top: -1em;
    left: -60px;
    text-align: center;
    z-index: 9;
    pointer-events: none;
    opacity: 0;
    transition: .3s;
  }
}







</style>
