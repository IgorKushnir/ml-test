<template>
  <div>
    <Seo title="Press about us" :breadcrumbs="[
        {
          title: 'Press about us',
        }
    ]"/>


    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader title="Press about us"/>

        <Container justify="justify-center">
          <div class="row gap-S">
            <template v-for="(item, index) in data">

              <div class="col-4 col-6-lg col-12-sm">
                <NuxtLink :to="item.attributes.url ?? '#'" target="_blank">
                  <div class="ratio-4x3 m-b-24 press-logo">
                    <Image :path="item.attributes.logo" :alt="item.attributes.title"/>
                  </div>
                </NuxtLink>

                <h2 class="m-t-0 h4 gray unset-uppercase">{{ item.attributes.title }}</h2>



                <p class="h2 dark-blue quote" v-if="item.attributes.description"><span class="quote before">"</span>{{ item.attributes.description }}"</p>

                <div class="m-t-16 m-t-24-sm">
                  <NuxtLink v-if="item.attributes.url" :to="item.attributes.url"
                            target="_blank"
                            class="button m-v-16 m-r-16 m-r-0-sm display-block-lg target lowercase">{{ getUrlTitle(item.attributes.url) }}
                  </NuxtLink>
                </div>
              </div>

            </template>
          </div>
        </Container>
      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>

</template>

<script setup>

import {getPressAboutUs} from "~/api/pressAboutUs";

const {data, pending, refresh, error} = await getPressAboutUs("en")

function getUrlTitle(url) {
  const u = new URL(url)
  return u.host
}


</script>

<style scoped>
.press-logo > .img-component-container :deep(.img-component.base) {
  /*opacity: .1;*/
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  mix-blend-mode: multiply;
  background-image: none;
  object-fit: fill;

}
.press-logo > .img-component-container :deep(.img-component.placeholder) {
  opacity: .2;

}

.unset-uppercase {
  text-transform: unset;
}

.quote {
  position: relative;
}
.quote.before {
  position: absolute;
  left: -.4em;
}
.quote.after {
  position: absolute;
  right: .4em;
}

</style>
