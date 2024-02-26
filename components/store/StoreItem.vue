<template>
  <div>
    <div class="store-item p-v-40 p-h-40 p-b-0-md p-h-0-md" >
      <div class="store-item-wrapper" :class="store.cover_1x1?.data ? 'half' : ''">
        <div>
          <div class="city-header">
            <div class="city-container">
              <Flag :code="store.country_code"/>
              <!--            <span v-if="!country">{{store.city}}{{store.state ? (', ' + store.state : '')}}</span>-->
              <span v-if="!country" v-html="store.city + (store.state ? ', ' + store.state : '')"/>
              <h3 v-if="country"  style="text-transform: unset">{{store.city}}</h3>
            </div>
            <div class="badge subheader light_bg p-v-8 p-h-8 m-b-0" v-if="store.badge">{{store.badge}}</div>
          </div>

          <h3 v-if="store.title" class="store-title m-t-8">{{store.title}}</h3>
          <div v-if="!country && store.premium" class="premium-badge">
            <img src="@/assets/img/premium-star.svg" width="24" height="24" alt="Premium client">
          </div>
          <p v-if="store.description" class="p-small">{{store.description}}</p>

          <div v-if="store.address || store.phone || store.website || store?.lines?.data.length > 0" class="contacts m-t-32 m-t-16-md">

            <div class="m-b-8">
              <a :href="'http://maps.google.com/?q='+store.city+', '+store.address" target="_blank" class="link normal">{{ store.address }}</a>
            </div>
            <!--          <br v-if="store.phone">-->
            <div v-if="store.phone" class="m-b-8">
              <a :href="'tel: '+store.phone" target="_blank" class="link normal">{{ store.phone }}</a>
            </div>
            <div v-if="store.website" class="m-b-8">
              <a :href="store.website" target="_blank" class="link normal">{{ store.website }}</a>
            </div>
            <div v-if="store.instagram">
              <span class="icon-instagram-16"/>
              <a v-if="store.instagram" :href="store.instagram" target="_blank" class="link normal">
                {{getInstagramName(store.instagram)}}
              </a>
            </div>




            <template v-if="store?.lines?.data.length > 0">
              <div class="subheader small m-t-32  m-t-16-md m-b-8 gray">Lines:</div>
              <div  class="p-small gray" v-for="line in store.lines.data">{{ line.attributes.title  }}</div>
              <!--          <p  class="p-small" >{{store.lines.data.map(line => line.attributes.title).join(', ')   }}</p>-->
            </template>
          </div>


        </div>

        <Button v-if="store.email || (store.alternative_appointment_button_url && store.alternative_appointment_button_url !== '')"
                :path="(store.alternative_appointment_button_url && store.alternative_appointment_button_url !== '') ? store.alternative_appointment_button_url : localePath('/request-an-appointment?q=' + encodeToBase64(JSON.stringify([route.params.country ?? store.country_code, store.city.toLowerCase(), store.title + ' (' +store.address + ')', store.email])))"
                class="m-t-32  m-t-16-md"
                fullWidth
        >
          {{ (store.alternative_appointment_button_text && store.alternative_appointment_button_text !== '') ? store.alternative_appointment_button_text : $t('request_an_appointment') }}
        </Button>

      </div>

      <div v-if="store.cover_1x1?.data" class="cover">
                    <Image :path="store.cover_1x1" :alt="store.title"/>
      </div>


    </div>

  </div>

</template>

<script setup>
import Flag from "./Flag";
import Button from "../Button";

const route = useRoute();

defineProps({
  store: {
    type: Object,
    required: true
  },
  countrySlug: {
    type: String,
  },
  country: {
    type: Boolean,
    required: false,
    default: false
  }
})


function encodeToBase64(string) {
  if (process.client) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const base64 = btoa(String.fromCharCode.apply(null, data));
    return base64;

  } else {
    return Buffer.from(string, 'utf-8').toString('base64');
  }
}
function getInstagramName(link) {
  const ar = link.split('/').filter(a => a !== '')
  return '@' + (ar[ar.length-1] ?? '')
}

</script>

<style scoped lang="scss">
.badge {
  position: absolute;
  right: 0;
  top: 0;
}
.store-item-wrapper {
  //display: flex;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}
.store-item-wrapper.half {
  width: 50%;
}
.cover {
  width: 50%;
  height: 100%;
  background-color: #0047e1;
  overflow: hidden;
  position: relative;
}

.store-item {
  display: flex;
  border: 1px solid $border-dark;
  height: 100%;
  gap: 40px


}
.store-item-wrapper > *:first-child {
  margin-top: 0;
}
.store-item-wrapper > *:last-child {
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
  position: relative;
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
  z-index: 5;
}
.icon-instagram-16 {
  font-size: 14px;
  margin-right: 8px;
}
@include md {
  .store-item {
    border: unset;
    border-top: 1px solid $border-dark;
  }
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
    z-index: 4;
    pointer-events: none;
    opacity: 0;
    transition: .3s;
  }
}

@include md {
  .store-item {
    flex-direction: column-reverse;
    .store-item-wrapper.half {
      width: 100%;
      height: auto;
    }
    .cover {
      aspect-ratio: 1;
      width: 100%;
    }
  }
}





</style>
