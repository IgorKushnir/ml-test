<template>
  <div>
<!--    <div class="errors">-->
<!--      <div v-for="error in consoleErrors"><pre>{{error}}</pre></div>-->
<!--    </div>-->
    <div v-if="!pending">
      <!--    Choose a service-->
      <!--    Select session date and time-->
      <InnerHeader v-if="step !== 0"
                   :sub_header="data.sub_header"
                   :title="data.title"
                   :sub_title="$t('warsaw_sub_title')"
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
          <li class="text-item">
            <span>
              Due to high demand, we are currently accepting <b>first-fitting appointments</b> only for brides whose wedding date is <b>at least 6 months</b> away. If your wedding is coming up sooner, please reach out to us directly to explore available booking options.
            </span>
          </li>
          <li class="text-item">
            <span>
              Feel free to invite your loved ones to join and share this significant moment with you. We allow <b>up to 3 guests</b> besides the bride to ensure a comfortable ambiance both for our clients and staff.
            </span>
          </li>
          <li class="text-item">
            <span>
              If you are a bride with a specific vision wanting to have a unique one-of-a-kind design, we offer <b>custom-made</b> dresses. Custom designs may require additional time and fees, depending on the complexity of the design - you can learn more during your appointment.
            </span>
          </li>
          <li class="text-item">
            <span>
              Our gowns range from <b>$1,000 to $12,000</b>, with an estimated production time of approximately <b>24-26 weeks</b>. We also offer a rush order option with production times under 16-18 weeks for an additional fee of +30% of the dress price.
            </span>
          </li>
          <li class="text-item">
            <span>
              The majority of our samples range from <b>S to XL</b>. If you need a larger size, please make sure to specify this on the registration form.
            </span>
          </li>
          <li class="text-item">
            <span>
              Prior to your visit, we recommend browsing through our catalog to explore your favored styles, silhouettes, and preferences. This proactive step will streamline the process of discovering your dream dress. Also, check our FAQ before booking.
            </span>
          </li>
        </ul>
        </Container>
        <div class="additional-text-wrap" v-if="step === 1">
          <p class="additional-text">Ready to take the most exciting step of your wedding prep journey?</p>
          <p class="additional-text">After you complete the survey form, our administrator will contact you within <b>24 hours.</b></p>
        </div>
        <Container v-if="step === 1" justify="justify-center">
        <FlagshipContactForm @goStep="(index) => goStep(index)" />
      </Container>
      <div class="additional-text-wrap additional-text-wrap--small" v-if="step === 1">
          <p class="additional-text">We're here to support you every step, ensuring a stress-free and joyful experience, so feel free to reach out to us at any time if you need help: <b>+48 882 153 873</b> or email us at <b>warsaw@millanova.com</b> <br>
            Our showroom is open Monday through Saturday from 10:00 to 19:00.</p>
        </div>

      <Container>
        <div class="col-12">
          <Fact :data="{background_color: 'light', logo: true, layout: 'wide'}">
            <div v-if="step===2" v-html="data.success" class="m-b-56"/>
            <div v-if="data.contact_title" class="subheader m-b-16">{{ data.contact_title }}</div>
            <div v-if="data.contact_address" class="m-b-8">
              <span class="icon-location-16"/>
              <a :href="(data.contact_address_url === null || data.contact_address_url === '') ? 'http://maps.google.com/?q='+data.contact_address : data.contact_address_url" target="_blank" class="link normal m-l-8">{{ data.contact_address }}</a>
            </div>
            <div v-if="data.contact_phone" class="m-b-32">
              <span class="icon-phone-16"/>
              <a :href="'tel: '+data.contact_phone.replaceAll(' ', '').replaceAll('-', '').replaceAll(')', '').replaceAll('(', '')" target="_blank" class="link normal  m-l-8">{{ data.contact_phone }}</a>
            </div>

            <template v-if="data.social">
              <NuxtLink v-for="(item, index) in data.social" :class="'icon-'+item.icon + (data?.social?.length > index+1 ? ' m-r-16' : '')" :to="item.url" target="_blank"
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
  width: 100%;
  max-width: 950px;
  text-align: center;

  &--small {
    max-width: 790px;
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
}

@include lg {

  .text-item {
    flex-basis: 100%;
  }
}
</style>
