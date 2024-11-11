<template>
  <div>
    <Seo title="Press about us" :breadcrumbs="[
        {
          title: $t('press_about_us'),
        }
    ]"
         :localizations="[{locale: 'en', slug: 'press-about-us'},{locale: 'pl', slug: 'prasa'}]"
    />

    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader :title="$t('press_about_us')"/>

        <Container justify="justify-center">
          <div class="row gap-S">
            <template v-for="(item, index) in data" :key="index">
              <div class="col-4 col-6-lg col-12-sm">
                <NuxtLink v-if="item.attributes.cover_4x3?.data" :to="item.attributes.url ?? '#'" target="_blank">
                  <div class="ratio-4x3 m-b-24">
                    <Image :path="item.attributes.cover_4x3" :alt="item.attributes.title"/>
                  </div>
                </NuxtLink>

                <NuxtLink v-if="item.attributes.logo?.data" :to="item.attributes.url ?? '#'" target="_blank" class="press-header-container m-b-24">
                  <div v-if="item.attributes.logo?.data" class="press-logo">
                    <div class="ratio-1x1">
                      <Image :path="item.attributes.logo" :alt="item.attributes.title"/>
                    </div>
                  </div>
                  <h2 class="m-t-0 m-b-0 h4 gray unset-uppercase">{{ item.attributes.title }}</h2>
                </NuxtLink>

                <p class="h2 dark-blue quote" v-if="item.attributes.description"><span class="quote before">"</span>{{ item.attributes.description }}"</p>

                <div class="m-t-16 m-t-24-sm">
                  <NuxtLink 
                    v-if="item.attributes.url" 
                    :to="item.attributes.url"
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

const {data, pending} = await getPressAboutUs("en")

function getUrlTitle(url) {
  const u = new URL(url)
  return u.host
}
</script>

<style scoped>
.press-header-container {
  display: flex;
  align-items: center;
  flex-direction: row;
}
.press-logo {
  width: 32px;
  height: 32px;
  display: block;
  margin-right: 16px;
  flex-shrink: 0;
}

.press-logo > div > .img-component-container :deep(.img-component.base) {
  background-image: none;
  object-fit: fill;
  object-position: bottom;

}
.press-logo > div > .img-component-container :deep(.img-component.placeholder) {
  display: none;
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
