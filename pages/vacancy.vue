<template>
  <div>
    <Seo title="Vacancy"/>
    <InnerHeader title="Vacancy"/>


    <div v-if="!pending">
      <Container
          v-if="data?.length > 0"
          justify="justify-center"
      >

        <template v-for="(item, index) in data">
          <div class="col-8  col-10-xl col-12-lg vacancy">
            <div>
              <h2 class="m-t-0">{{ item.attributes.title }}</h2>
              <div v-if="item.attributes.location">
                <span class="icon-location-16 p-small m-r-8"></span>
                <span class="p-small">{{ item.attributes.location }}</span>
              </div>
              <div
                  v-html="item.attributes.content"
                  class="content m-t-16"
                  ref="content"
              />
              <div class="link m-t-16" ref="link" style="display: none;" v-on:click="toggleContent(index)">Show more <span class="icon-drop-down-16"  style="vertical-align: middle;"/></div>
            </div>
            <NuxtLink class="button target" v-if="item.attributes.job_link" :to="item.attributes.job_link" target="_blank">Apply for</NuxtLink>
          </div>


          <div class="col-8  col-10-xl col-12-lg m-v-32 m-v-0-md" v-if="data.length - 1 > index"><div class="divider"/></div>

        </template>
      </Container>
      <Container
          v-if="data?.length > 0"
          justify="justify-center"
      >
        <div v-if="newsletterData?.promo" class="col-10 col-12-xl">
          <Promo
              :title="newsletterData.promo.title"
              :description="newsletterData.promo.description"
              :subheader="newsletterData.promo.sub_header"
              :button="newsletterData.promo.button"
              :button_text="newsletterData.promo.button_text"
              :button_link="newsletterData.promo.button_link"
          />
        </div>
      </Container>
      <State
          v-else
          title="No open positions at the moment"
          text="Be the first to learn about Milla Nova latest positions."
          :button="{text: 'Subscribe', path: '/newsletter'}"
          image-path="/img/decline.svg"
          class="half"
      />
    </div>

    <Loading :pending="pending"/>
  </div>
</template>

<script setup>
import vacancyResponse from '~/api/getVacancies'
import State from "../components/State";
import Container from "../components/Container";
import Promo from "../components/Promo";
import newsletterResponse from "~/api/getNewsletter";
const nuxtApp = useNuxtApp()

const {data, pending, refresh, error} = useLazyAsyncData('vacancy', () => vacancyResponse({ lang: "en" }), { transform: (d) => d.data?.vacancies?.data })
const {data: newsletterData} = useLazyAsyncData('newsletter', () => newsletterResponse({ lang: "en" }), { transform: (d) => d.data?.newsletter?.data?.attributes })

const content = ref()
const link = ref()

watch(pending, () => {
  setTimeout(checkReedMoreButton, 500)
})
nuxtApp.hook("page:resize", () => {
  checkReedMoreButton()
})

function checkReedMoreButton() {
  if (content.value) {
    content.value.forEach((item, index) => {
      const contentHeight = item.scrollHeight;
      if (contentHeight > item.clientHeight) {
        link.value[index].style.display = "inline-block"
        content.value[index].classList.remove('visible')
      } else {
        link.value[index].style.display = "none"
        content.value[index].classList.add('visible')
      }
    })
  }
}

function toggleContent(index) {
  const contentHeight = content.value[index].scrollHeight;

  const classList = content.value[index].classList;
  if (classList.contains('visible')) {
    classList.remove('visible')
    content.value[index].style.height = null
    link.value[index].innerHTML = 'Show more <span class="icon-drop-down-16"  style="vertical-align: middle;"/>'
  } else {
    classList.add('visible')
    content.value[index].style.height = contentHeight + "px"
    link.value[index].innerHTML = 'Show less <span class="icon-drop-up-16" style="vertical-align: middle;"/>'
  }
  // console.log(contentHeight);
}


</script>

<style scoped lang="scss">
.content {
  height: 4.2em;
  overflow: hidden;
  position: relative;
  transition: height 0.3s ease-in-out;
}
.content :deep(*):first-child {
  margin-top: unset;
}
.content :deep(*):last-child {
  margin-bottom: unset;
}
.content:after {
  content: "";
  pointer-events: none;
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, rgba($white, 0) 0%, $white 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}
.content.visible:after {
  opacity: 0;
}
.vacancy {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
}
.divider {
  height: 1px;
  width: 100%;
  background-color: $border-dark;
}
.button {
  flex-shrink: 0;
  align-self: center;
}

@include md {
  .vacancy {
    flex-direction: column;
  }
  .button {
    width: 100%;
  }
}

</style>
