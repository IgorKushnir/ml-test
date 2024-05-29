<template>
  <div>
    <Seo :data="data?.attributes" :breadcrumbs="[
        {
          title: 'Trunk shows',
          path: '/trunk-shows/' + data?.attributes?.slug,
        },
        {
          title: data?.attributes?.title,
        }
    ]"
         :pathToPage="{en: 'trunk-shows', pl: 'pokazy'}"
         :localizations="data?.attributes?.localizations?.data"
    />

    <transition name="fade">
      <div v-if="!pending && data != null">
        <Container justify="justify-center">
          <div class="col-8 col-10-xl col-12-lg">
            <div class="ratio-16x9">
              <Image :path="data.attributes.cover_4x3" alt=""/>
            </div>


            <div class="head center m-v-80 m-v-40-md">
              <div class="subheader gray">Trunk show</div>
              <h1 class="title">{{data.attributes.title}}</h1>
              <NuxtLink v-if="data.attributes.apply_for" :to="$isUrl(data.attributes.apply_for) ? data.attributes.apply_for : localePath(data.attributes.apply_for)" :target="$isUrl(data.attributes.apply_for) ? '_blank' : '_self'" rel="nofollow" class="button primary m-v-8" :class="$isUrl(data.attributes.apply_for) ? 'target' : ''">Apply for</NuxtLink>
            </div>


            <div class="brake-line m-v-40 m-v-32-md"></div>
            <div class="subheader medium">Information</div>

            <div class="row">
              <div class="col-6 col-12-md m-v-12"><ListIcon icon="calendar-16">{{ $getDatesInRange(data.attributes.from, data.attributes.to, $getMonths, true) }}</ListIcon></div>
              <div class="col-6 col-12-md m-v-12" v-if="data.attributes.phone"><ListIcon icon="phone-16" :to="'tel: '+data.attributes.phone"><span class="link">{{ data.attributes.phone }}</span></ListIcon></div>
              <div class="col-6 col-12-md m-v-12" v-if="data.attributes.address">
                <ListIcon icon="location-16" :to="'https://www.google.com/maps/place/'+data.attributes.address"  target="_blank">
                  {{ data.attributes.address }}
                  <div class="display-block m-t-8">
                    <div class="p-small link" style="display: inline-block">Show on map <span class="icon-taget-16"/></div>
                  </div>
                </ListIcon>
              </div>
              <div class="col-6 col-12-md m-v-12" v-if="data.attributes.website"><ListIcon icon="taget-16" :to="data.attributes.website" target="_blank"><span class="link">{{ data.attributes.website }}</span></ListIcon></div>

            </div>

            <div class="brake-line m-t-32 m-t-24-md m-b-40 m-b-32-md"></div>


            <div v-html="data.attributes.content"/>

          </div>
        </Container>

        <Carusel
            class="show-md"
            v-if="data.attributes.offered"
            :data="data.attributes.offered.products.data"
            :column="4"
            col-class="col-8 col-10-xl col-12-lg"
            layout="normal"
            nav-compact
        >
          <h2 class="m-t-0 m-b-40 m-b-24-md">Product offered</h2>
        </Carusel>




        <Container justify="justify-center" class="hide-md" v-if="data.attributes.offered">
          <h2 class="col-8 col-10-xl col-12-lg m-t-0 m-b-0">Product offered</h2>

<!--          <div class="col-8 col-10-xl col-12-lg ">-->
            <div class="container col-8 col-10-xl col-12-lg  ">
              <div class="row gap-S">
            <NuxtLink
                v-for="item in data.attributes.offered?.products?.data"
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


      </div>
    </transition>
    <Loading :pending="pending"/>
    <PageNotFound :show="data === null"/>
  </div>
</template>

<script setup>
import {getTrunkShow} from '~/api/trunkShows'
import Container from "../../components/Container";
const route = useRoute();
let slug = route.params.slug;
const { $getMonths, $getDatesInRange, $isUrl } = useNuxtApp()

const { locale } = useI18n()

let {data, pending, refresh, error} = await getTrunkShow(slug, locale.value)

onMounted(() => {
  refresh()
})

</script>

<style scoped lang="scss">
@media (hover: hover) {
  :deep(.img-component.base) {
    transition: .3s ease-in-out;
  }
  :deep(.m-t-16) {
    transition: 0.2s ease-in-out;
  }
  .img-hover:hover {

    :deep(.img-component.base) {
      transform: scale(1.1);
    }

    :deep(.m-t-16) {
      transform: translateY(-4px);
    }
  }
}
</style>
