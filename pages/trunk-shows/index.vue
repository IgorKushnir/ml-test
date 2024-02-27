<template>
  <div>
    <Seo :title="$t('trunk_shows')" :breadcrumbs="[
        {
          title: $t('trunk_shows'),
        },
    ]"
         :localizations="[{locale: 'en', slug: 'trunk-shows'}, {locale: 'pl', slug: 'pokazy'}]"
    />

    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader :title="$t('trunk_shows')"/>

        <Container justify="justify-center">
          <div class="row gap-S">
            <template v-for="(item, index) in data">
              <div v-if="getMonthSection[index]" class="col-12 subheader center m-b-32 m-b-0-xl">
                {{ getMonthSection[index] }}
              </div>

              <div class="col-4 col-6-lg col-12-sm">
                <NuxtLink :to="localePath('/trunk-shows/'+item.attributes.slug)">
                  <div class="ratio-4x3 m-b-24">
                    <Image :path="item.attributes.cover_4x3" :alt="item.attributes.title"/>
                  </div>
                </NuxtLink>

                <NuxtLink :to="localePath('/trunk-shows/'+item.attributes.slug)">
                  <h2 class="m-t-0">{{ item.attributes.title }}</h2>
                </NuxtLink>
                <span><strong>{{ $getDatesInRange(item.attributes.from, item.attributes.to, $getMonths) }}</strong></span>
                <span class="m-l-16">
                  <span class="icon-location-16 p-small m-r-8"/>
                  <span>{{ [item.attributes.city, item.attributes.country].join(', ') }}</span>
                </span>
                <p v-if="item.attributes.description">{{ item.attributes.description }}</p>

                <div class="m-t-16 m-t-24-sm">
                  <NuxtLink :to="localePath('/trunk-shows/'+item.attributes.slug)"
                            class="button m-v-16 m-r-16 m-r-0-sm display-block-lg">Learn more
                  </NuxtLink>
<!--                  <NuxtLink v-if="item.attributes.apply_for" :to="item.attributes.apply_for" target="_blank"-->
<!--                            rel="nofollow" class="button m-v-16 primary target display-block-sm">Apply for-->
<!--                  </NuxtLink>-->
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
import {getTrunkShows} from '~/api/trunkShows'
const { locale } = useI18n()

let {data, pending, refresh, error} = await getTrunkShows(locale.value)

const {$getMonths, $getDatesInRange} = useNuxtApp()


const getMonthSection = computed(() => {
  let d = data.value.map(e => {
    const date = new Date(e.attributes.from)
    return [date.getUTCMonth(), date.getUTCFullYear()]
  })
  let prev;
  d.forEach((e, i) => {
    if (e[0] !== prev) {
      prev = e[0];
      d[i] = $getMonths[e[0]][0] + ' ' + e[1]
    } else {
      d[i] = null;
    }
  })
  return d;
})


</script>

<style scoped lang="scss">


.subheader:not(:first-child) {
  position: relative;
  margin-top: 120px;
}

.subheader:not(:first-child):after {
  content: '';
  width: 100%;
  height: 1px;
  position: absolute;
  left: 0;
  top: -80px;
  background-color: $border-dark;
}

@include xl {
  .subheader:not(:first-child) {
    margin-top: 80px;
  }
  .subheader:not(:first-child):after {
    top: -40px;
  }
}


</style>
