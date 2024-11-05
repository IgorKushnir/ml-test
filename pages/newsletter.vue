<template>
  <div>
    <Seo :data="data" :breadcrumbs="[
        {
          title: 'Newsletter',
        }
    ]"/>
    <div v-if="!pending">
      <InnerHeader :title="data?.title" :sub_title="data?.description"/>


      <transition name="fade" mode="out-in">
        <Container v-if="!feedback" justify="justify-center">
          <div class="col-6 col-8-xl col-10-lg col-12-md">

            <form  @submit.prevent="subscribe">
              <template v-if="data?.type?.length > 0">
                <h3 class="m-t-0">You are interested in:</h3>

                <div class="m-t-32 m-b-56" ref="optionsEl">
                  <CheckBox
                      v-for="item in data.type"
                      :label="item?.title"
                      :description="item?.description"
                      :value="item.value ?? false"
                      available
                      @click="item.value = !item.value"
                  />
                  <label  class="error-message">Choose at least one option</label>
                </div>
              </template>


              <div class="form m-b-24">
                <div class="input-block c-2" ref="emailEl">
                  <label>Your email</label>
                  <input
                      autofocus
                      class="input m-t-8"
                      type="email"
                      name="Your email"
                      v-model="email"
                      placeholder="email@example.com"
                      required
                  />
                  <label  class="error-message">{{ emailErrorMessage }}</label>

                </div>

              </div>

              <div class="button primary" :class="loading ? 'loading' : ''" v-on:click="subscribe">
                <transition name="fade" mode="out-in">
                  <span v-if="!loading">Subscribe</span>
                  <Spinner v-else white/>
                </transition>
              </div>

            </form>

          </div>
        </Container>
        <State v-else
               :title="feedbackContent?.title"
               :text="feedbackContent?.text"
               :button="feedbackContent?.button"
               class="half"
               @click="stateButtonClickHandle"
               :image-path="feedbackContent?.imagePath"
        />
      </transition>

    </div>
    <Loading :pending="pending"/>
  </div>
</template>

<script setup>
import newsletterResponse from "~/api/getNewsletter";
import Container from "../components/Container";
import CheckBox from "../components/filter/CheckBox";
import State from "../components/State";
const { $validateEmail } = useNuxtApp();
const config = useRuntimeConfig();
const apiUrl = config.public.strapi.url;

const {
  data,
  pending,
  refresh,
  error
} = useLazyAsyncData('newsletter', () => newsletterResponse({lang: "en"}), {transform: (d) => d.data?.newsletter?.data?.attributes})


const feedback = ref(false)
const feedbackContent = ref({
  title: null,
  text: null,
  button: null
})

const loading = ref(false)
const emailEl = ref()
const emailErrorMessage = ref("")
const optionsEl = ref()
const email = ref()
let query = useRoute().query?.subscribe
query ? query = query.split(',') : query = []

onMounted(() => {
  if (data.value) {
    checkQueries()
  } else {
    watch(data, (d) => {
      checkQueries()
    })
  }
})
function checkQueries() {
  query?.forEach(q => {
    const index = data.value?.type.findIndex(e => (e?.title === q) || (e?.title?.toLowerCase() === q))
    if(index !== -1) {
      data.value.type[index].value = true
    }
  })
}



function subscribe() {
  let errors = [];

  // Validate Email
  if (email.value && email.value?.length > 0) {
    if(!$validateEmail(email.value)) {
      emailErrorMessage.value = 'Enter valid email address';
      emailEl.value.classList.add('error')
      errors.push(true)
    } else {
      emailEl.value.classList.remove('error')
    }
  } else {
    emailErrorMessage.value = 'The field must not be empty';
    emailEl.value.classList.add('error')
    errors.push(true)
  }

  // Validate options
  let options = []
  if (data.value.type && data.value.type?.length > 0) {
    data.value.type?.forEach(t => {
      if (t.value) {
        options.push(t?.title)
      }
    })

    if (options?.length === 0) {
      optionsEl.value.classList.add('error')
      errors.push(true)
    } else {
      optionsEl.value.classList.remove('error')
    }
  }


  // Validate is ready to send
  if (errors?.length === 0) {
    subscribeFetch(email.value, options)
  }
}

function subscribeFetch(email, options) {
  loading.value = true

  $fetch(apiUrl + '/email-provider/subscribe',
      {
        method: 'post',
        body: {
          "options": options.join(', '),
          "email": email
        }
      }
  ).then(res => {
    if (res) {
      feedbackContent.value = {
        title: "You successfully subscribed",
        text: "Thank your for your subscription. The newsletter will be sent by MillaNova team to your e-mail address.",
        button: null
      }
    } else {
      feedbackContent.value = {
        title: "Something went wrong",
        text: "Please try again.",
        imagePath: '/img/decline.svg',
        button: {
          text: "Try again",
          path: '/newsletter'
        }
      }
    }
    feedback.value = true;
    loading.value = false
  }).catch(error =>{
    feedbackContent.value = {
      title: "Something went wrong",
      text: "Please try again.",
      imagePath: '/img/decline.svg',
      button: {
        text: "Try again",
        path: '/newsletter'
      }
    }
    feedback.value = true;
    loading.value = false
  })
}

function stateButtonClickHandle() {
  feedback.value = false
}

</script>

<style scoped lang="scss">
@include md {
  .button {
    display: block;
  }
}

</style>
