<template>
    <Container justify="justify-center" class="hide-md" >
          <h2 class="col-8 col-10-xl col-12-lg m-t-0 m-b-0">Product offered</h2>
            <div class="container col-8 col-10-xl col-12-lg  ">
              <div class="row gap-S">
            <NuxtLink
                v-for="item in productsData"
                class="img-hover col-3 col-4-lg col-6-md col-12-sm"
                :to="localePath('/product/' + item?.attributes?.slug)"
                target="_self"
            >
              <div class="ratio-3x4">
                <Image :path="item.attributes.cover_3x4" :alt="item.attributes.title"/>
              </div>
              <div v-if="item.attributes.title || item.attributes.text" class="m-t-16">
                <div v-if="item.attributes.title" class="p dark-blue m-v-8"><strong>{{
                    item.attributes.title
                  }}</strong></div>
                <div v-if="item.attributes.text" class="p m-v-8 gray">{{ item.attributes.text }}</div>
              </div>
            </NuxtLink>
          </div>
          </div>
    </Container>
</template>

<script setup>
import Container from "~/components/Container";

defineProps({
    productsData: {
        type: Object,
        required: false
    }
})
</script>