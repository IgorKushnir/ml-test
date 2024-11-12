<template>
  <div>
    <div v-if="!pending">
      <InnerHeader v-if="step !== 0"
                   :sub_header="data.sub_header"
                   :title="data.title"
                   :sub_title="$t('warsaw_sub_title')"
                   :hideBorder="true"
      />
      <FlagshipStepOne
          v-if="step === 0"
          @serviceId="(id) => goStep(id)"
          :sub_header="data.sub_header"
          :title="data.title"
          :cover="data.cover_4x3"
          :text="data.description"
          :services="services"
          :content="data?.content"/>
      <Container v-if="step === 1" justify="justify-center">
        <ul class="text-list">
          <FlagshipInfoItem :title="t('appointment_timeline')">
            <span>
              {{ $t("book_text_1") }}
              <b>{{ $t("book_text_2") }}</b>
              {{ $t("book_text_3") }}
              <b>{{ $t("book_text_4") }}</b>
              {{ $t("book_text_5") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('guest_policy')">
            <span>
              {{ $t("book_text_6") }}
              <b>{{ $t("book_text_7") }}</b>
              {{ $t("book_text_8") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('custom_made_dresses')">
            <span>
              {{ $t("book_text_9") }}
              <b>{{ $t("book_text_10") }}</b>
              {{ $t("book_text_11") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('pricing_production_time')">
            <span>
              {{ $t("book_text_12") }}
              <b>{{ $t("book_text_13") }}</b>
              {{ $t("book_text_14") }}
              <b>{{ $t("book_text_15") }}</b>
              {{ $t("book_text_16") }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('sample_sizes')">
            <span>
              {{ $t("book_text_17") }}
              <b>{{ $t("book_text_18") }}</b>
              {{$t("book_text_19")  }}
            </span>
          </FlagshipInfoItem>
          <FlagshipInfoItem :title="t('prepare_for_your_visit')">
            <span>
              {{ $t("book_text_20") }}
              <a href="https://warsaw.millanova.com/collections/dresses?hide_prices=true ">{{ $t("book_text_20_link") }}</a>
              {{ $t("book_text_20_2") }}
            </span>
          </FlagshipInfoItem>
        </ul>
        </Container>
        <div class="additional-text-wrap" v-if="step === 1">
          <p class="additional-text">{{ $t("book_text_21") }}</p>
          <p class="additional-text">{{ $t("book_text_22") }}<b>{{ $t("book_text_23") }}</b></p>
        </div>
        <Container v-if="step === 1" justify="justify-center">
        <FlagshipContactForm @goStep="(index) => goStep(index)" />
      </Container>
      <div class="additional-text-wrap additional-text-wrap--small" v-if="step === 1">
          <p class="additional-text">{{ $t("book_text_24") }}
            <b>+48 882 153 873</b>
            {{ $t("book_text_25") }}
            <b>warsaw@millanova.com</b> <br>
            {{ $t("book_text_26") }}</p>
        </div>
      <Container>
        <div class="col-12">
          <Fact :data="{background_color: 'light', logo: true, layout: 'wide'}">
            <div v-if="step===2" v-html="data.success" class="m-b-56"/>
            <div v-if="data.contact_title" class="subheader m-b-16">{{ data.contact_title }}</div>
            <div v-if="data.contact_address" class="m-b-8">
              <span class="icon-location-16"/>
              <a :href="(data.contact_address_url === null || data.contact_address_url === '') ? `http://maps.google.com/?q=${data.contact_address}` : data.contact_address_url" target="_blank" class="link normal m-l-8">{{ data.contact_address }}</a>
            </div>
            <div v-if="data.contact_phone" class="m-b-32">
              <span class="icon-phone-16"/>
              <a :href="`tel: ${data.contact_phone.replaceAll(' ', '').replaceAll('-', '').replaceAll(')', '').replaceAll('(', '')}`" target="_blank" class="link normal  m-l-8">{{ data.contact_phone }}</a>
            </div>

            <template v-if="data.social">
              <NuxtLink 
                v-for="(item, index) in data.social" 
                :class="`icon-${item.icon}${(data?.social?.length > index + 1 ? ' m-r-16' : '')}`" 
                :to="item.url" target="_blank"
                class="social hover"/>
            </template>
          </Fact>
        </div>
      </Container>
    </div>
    <Seo
        :data="data"
        :title="data?.title"
        :breadcrumbs="[
        {
          title: data?.title,
        }
    ]"
        :localizations="[{locale: 'en', slug: 'warsaw'}, {locale: 'pl', slug: 'warszawa'}]"
    />
  </div>
</template>

<script setup>
import getFlagship from '~/api/getFlagship'

const { t, locale } = useI18n()
const step = ref(0)
const steps = ref([
  {
    name: t('book_step_1'),
    active: false
  },
  {
    name: t('book_step_2'),
    active: false
  },
  {
    name: t('book_step_3'),
    active: false
  },
])

const services = [
  {
    service_id: 1,
    title: t("wedding_dresses")
  },
  // {
  //   service_id: 2,
  //   title: t("evening_dresses")
  // }
]

let { data, pending } = await getFlagship(locale.value)

function goStep(_step, payload) {
  step.value = _step
  if (_step === 1) {
    if (payload) {
      selectedServiceId.value = payload
    }
  }
  if (_step === 2) {
    fbq('track', 'Lead');  // Pixel??
    if (process.env.GTAG_KEY && gtag) {
      gtag('event', 'success_form', {
      'send_to': `${process.env.GTAG_KEY}/E3k4COnnw5cZELm1yqY9`,
      peopleJoinWithMe: userData.value.people,
      howDidIFindOut: userData.value.find_out ?? 'null'
    });
    console.log('event-sent');
  }
  }

  window.scroll({
    top: 0,
    behavior: "smooth"
  })
}
</script>

<style scoped lang="scss">

.errors {
  position: fixed;
  z-index: 100;
  font-size: 10px;
  background-color: #ffeaea;
}


.social {
  margin: 16px 8px;
  font-size: 20px;
  height: 24px;
  display: inline-block;
  width: 24px;
  padding: 2px;
}

.text-list {
  padding: 0;
  margin: 0 auto;
  width: 100%;
  max-width: 950px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 40px;
  list-style: none;
}

.text-item {
  flex-basis: 48%;
  padding-top: 24px;
  border-top: 1px solid $border-dark;
  color: $gray;
  font-weight: 400;
font-size: 18px;
}

.additional-text-wrap {
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
  max-width: 1104px;
  text-align: center;

  &--small {
    max-width: 854px;
  }
}

.additional-text {
  margin: 8px 0;
}

@include md {
  .social {
    margin: 4px;
    font-size: 22px;
    height: auto;
    width: auto;
    padding: 12px;
  }

  .text-list {
    row-gap: 0;
  }
}

@include lg {

  .text-item {
    flex-basis: 100%;
  }
}
</style>
