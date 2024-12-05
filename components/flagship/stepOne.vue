<template>
  <Container>
    <div class="col-6 col-12-lg">
      <div class="ratio-1x1">
        <Image :path="cover" :alt="title"/>
      </div>
    </div>
    <div class="col-6 col-12-lg">
      <div class="new-ratio-1x1">
        <div class="contact">
          <span class="subheader m-b-0">{{ sub_header }}</span>
          <h1 class="title">{{ title }}</h1>
          <p class="m-t-0 text-center">{{text}}</p>
          <Loader v-if="!services"/>

          <transition name="fade" mode="out-in">
            <div v-if="services?.length > 0" class="navs m-v-8 m-v-0-lg">
              <div class="h4 m-b-24">{{ $t('choose_a_service') }}</div>
              <template v-if="!isDressTypeSelected">
                <div class="nav-button" @click="() => isDressTypeSelected = true">
                  <span class="nav-link">{{ $t('wedding_dresses') }}</span>
                  <span class="icon-arrow-16"/>
                </div>
              </template>
              <template v-if="isDressTypeSelected">
                <div class="nav-button" v-for="service in services" v-on:click="() => select(service.service_id)">
                  <span class="nav-link">{{ service.title }}</span>
                  <span class="icon-arrow-16"/>
                </div>
              </template>
            </div>
          </transition>

        </div>

      </div>

    </div>
    <template v-if="content">
      <template v-for="data in content">
        <LazyContent :data="data"/>
      </template>
    </template>

  </Container>
</template>

<script setup>
import { ref } from 'vue';
const { t } = useI18n()

const emits = defineEmits(['serviceId'])
defineProps({
  services: {
    type: Array,
    // required: true
  },
  sub_header: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  cover: {
    type: Object
  },
  content: {
  type: Object
  },
})

const isDressTypeSelected = ref(false)

function select(id) {
  emits('serviceId', id)
}

</script>

<style scoped lang="scss">


.contact {
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  * {
    max-width: 400px;
  }
  .navs {
    width: 100%;
  }
}
@include lg {
  .new-ratio-1x1 {
    aspect-ratio: unset;
  }
}

</style>
