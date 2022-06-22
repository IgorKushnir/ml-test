<template>
  <div>
    <transition name="fade">
      <div v-if="!pending && data != null">
        <InnerHeader title="Trunk shows"/>

        <Container justify="justify-center">
          <div class="col-8 col-10-xl col-12-lg">
            <template v-for="(item, index) in data" >

              <div v-if="getMonthSection[index]" class="subheader center m-b-80 m-b-40-xl">{{getMonthSection[index]}}</div>

              <div class="row gap-L m-b-40">

                <div class="col-6 col-4-md col-12-sm">
                  <NuxtLink :to="'/trunk-shows/'+item.attributes.slug">
                    <div class="ratio-4x3">
                      <Image :path="item.attributes.cover_4x3" :alt="item.attributes.title" />
                    </div>
                  </NuxtLink>
                </div>

                <div class="col-6 col-8-md  col-12-sm p-t-8-sm">
                  <NuxtLink :to="'/trunk-shows/'+item.attributes.slug">
                    <h2 class="m-t-0">{{item.attributes.title}}</h2>
                  </NuxtLink>
                  <span><strong>{{getDatesInRange(item.attributes.from, item.attributes.to)}}</strong></span>
                  <span class="m-l-16">
                  <span class="icon-location-16 p-small m-r-8"/>
                  <span>{{ [item.attributes.city, item.attributes.country].join(', ') }}</span>
                </span>
                  <p v-if="item.attributes.description">{{item.attributes.description}}</p>

                  <div class="m-t-16 m-t-24-sm">
                    <NuxtLink :to="'/trunk-shows/'+item.attributes.slug" class="button m-v-16 m-r-16 m-r-0-sm display-block-sm">Learn more</NuxtLink>
                    <NuxtLink v-if="item.attributes.apply_for" :to="item.attributes.apply_for" target="_blank" class="button m-v-16 primary target display-block-sm">Apply for</NuxtLink>
                  </div>
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
let {data, pending, refresh, error} = await getTrunkShows('en')

const months = [
  ['February', 'Feb.'],
  ['March', 'Mar.'],
  ['April', 'Apr.'],
  ['May', 'May'],
  ['June', 'Jun.'],
  ['July', 'Jul.'],
  ['August', 'Aug.'],
  ['September', 'Sep..'],
  ['October', 'Oct.'],
  ['November', 'Nov.'],
  ['December ', 'Dec.'],
]
function getDatesInRange(from, to) {
  const _from = new Date(from);
  const _to = new Date(to);
  const compareDate = (_from.getMonth() + _from.getFullYear()) === (_to.getMonth() + _to.getFullYear())


  const mFrom = months[_from.getMonth() - 1][1]
  const mTo = months[_to.getMonth() - 1][1]
  if (compareDate) {
    return mFrom + ' ' + _from.getDate() + '-' + _to.getDate()  ;
  }
  return mFrom + ' ' + _from.getDate() + ' - ' + mTo + ' ' +  _to.getDate();
}

const getMonthSection = computed(()=> {
  let d = data.value.map(e => {
    const date = new Date(e.attributes.from)
    return[date.getMonth(), date.getFullYear()]
  })
  let prev;
  d.forEach((e, i) => {
    if (e[0] !== prev) {
      prev = e[0];
      d[i] = months[e[0] - 1][0] + ' ' + e[1]
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
