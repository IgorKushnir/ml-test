<template>
    <Container justify="justify-center">
          <div class="col-8 col-10-xl col-12-lg">
            <div class="ratio-16x9">
              <Image :path="data.attributes.cover_4x3" alt=""/>
            </div>
            <div class="head center m-v-80 m-v-40-md">
              <div class="subheader gray">Trunk show</div>
              <h1 class="title">{{data.attributes.title}}</h1>
              <NuxtLink 
                v-if="data.attributes.apply_for" 
                :to="applyForLink" 
                :target="$isUrl(data.attributes.apply_for) ? '_blank' : '_self'" rel="nofollow" 
                class="button primary m-v-8" 
                :class="$isUrl(data.attributes.apply_for) ? 'target' : ''"
                >Apply for</NuxtLink>
            </div>
            <div class="brake-line m-v-40 m-v-32-md"></div>
            <div class="subheader medium">Information</div>
            <div class="row">
              <div class="col-6 col-12-md m-v-12">
                <ListIcon icon="calendar-16">{{ $getDatesInRange(data.attributes.from, data.attributes.to, $getMonths, true) }}</ListIcon>
              </div>
              <div class="col-6 col-12-md m-v-12" v-if="data.attributes.phone">
                <ListIcon icon="phone-16" :to="`tel: ${data.attributes.phone}`">
                    <span class="link">{{ data.attributes.phone }}</span>
                </ListIcon>
               </div>
              <div class="col-6 col-12-md m-v-12" v-if="data.attributes.address">
                <ListIcon icon="location-16" 
                :to="`https://www.google.com/maps/place/${data.attributes.address}`"  target="_blank" 
                rel="nofollow">
                  {{ data.attributes.address }}
                  <div class="display-block m-t-8">
                    <div class="p-small link" style="display: inline-block">Show on map <span class="icon-taget-16"/></div>
                  </div>
                </ListIcon>
              </div>
              <div class="col-6 col-12-md m-v-12" 
              v-if="data.attributes.website">
                <ListIcon icon="taget-16" 
                    :to="data.attributes.website" target="_blank" 
                    rel="nofollow">
                    <span class="link">{{ data.attributes.website }}</span>
                </ListIcon>
              </div>
            </div>
            <div class="brake-line m-t-32 m-t-24-md m-b-40 m-b-32-md" />
            <div v-html="data.attributes.content"/>
          </div>
        </Container>
</template>

<script setup>
import Container from "~/components/Container";

const props = defineProps({
    data: Object,
    required: false
})

const { $getMonths, $getDatesInRange, $isUrl } = useNuxtApp()

const applyForLink = computed(() => $isUrl(props.data.attributes.apply_for) ? props.data.attributes.apply_for : localePath(props.data.attributes.apply_for))
</script>