<template>
  <div>
    <div v-if="item">
      <InnerHeader :title="item.title"/>
      <StickyBarStickyHeaderMilla>
        <template #center>
          <StickyBarStickyMenu :data="data.entry" path="/contact?form=" :activeItem="index"/>
        </template>
      </StickyBarStickyHeaderMilla>


      <transition mode="out-in" name="fade">

        <Container justify="justify-center" v-if="!sent">
          <form class="col-6 col-8-xl col-10-lg col-12-md form" @submit.prevent="send">
            <template v-for="(formItem, index) in item.form">
              <div class="input-block" :class="'c-'+formItem.size + (sendData[formItem.title].error ? ' error' : '')">
                <label v-if="formItem.type !== 'divider'" class="p-small" :for="index" :class="formItem.required ? 'required' : ''">{{ formItem.title }}</label>
                <div v-if="formItem.type === 'divider'" class="subheader small m-b-8 m-t-32">{{ formItem.title }}</div>
                <input
                    v-if="formItem.type !== 'textarea' && formItem.type !== 'divider'"
                    :autofocus="index === 0"
                    class="input m-t-8"
                    :type="formItem.type"
                    :name="formItem.title"
                    v-model="sendData[formItem.title].value"
                    :id="index"
                    :disabled="loading"
                />
                <textarea
                    v-if="formItem.type === 'textarea'"
                    :autofocus="index === 0"
                    class="input m-t-8"
                    :name="formItem.title"
                    v-model="sendData[formItem.title].value"
                    :id="index"
                    :disabled="loading"
                />
                <label v-if="sendData[formItem.title].error" :for="index" class="error-message">{{ sendData[formItem.title].error }}</label>
              </div>
            </template>
            <input type="submit" title="Send" style="display: none"/>

            <div class="c-4 m-v-24 center">
              <div class="button primary" :class="loading ? 'loading' : ''" v-on:click="send">
                <transition name="fade" mode="out-in">
                  <span v-if="!loading">Send</span>
                  <Spinner v-else white/>
                </transition>
              </div>

            </div>
          </form>
        </Container>


        <State v-else :title="item.successful_message_sent_title" :text="item.successful_message_sent_text" :button="{text: 'Home page', path: '/'}" />
      </transition>

    </div>

    <PageNotFound :show="!item"/>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const apiUrl = config.public.strapi.url;

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true
  },
})

const index = computed(() => props.data.entry.findIndex(i => i.slug === props.type))
const item = computed(() => props.data.entry.find(i => i.slug === props.type))

const sendData = ref({})
const loading = ref(false)
const sent = ref(false)

function generateData() {
  sendData.value = {}
  item.value.form.forEach(e => {
    sendData.value[e.title] =  {
      value: '',
      type: e.type,
      required: e.required,
      error: null
    };
  })
}
generateData();
watch(index, () => {
  sent.value = false;
  loading.value = false;
  generateData()
})

function checkField(key, data) {
  const item = sendData.value[key];
  if (item.required) {
    if (item.value.length === 0) {
      item.error = 'The field must not be empty';
      return
    }

  }
  item.error = null;
}

function send() {
  const keys = Object.keys(sendData.value);
  keys.forEach(key => {
    checkField(key, sendData.value[key])
  })
  const error = keys.map(key => sendData.value[key].error !== null).includes(true)
  if (error) {
    // console.log('error');
  } else {
    loading.value = true;

    $fetch(apiUrl + '/email-provider/send',
        {
          method: 'post',
          body: {
            "data": {
              "emails": item.value.emails,
              "subject": item.value.title,
              "data": sendData.value
            }
          }
        }
    ).then(res => {
      // console.log(res);
      sent.value = true;
    }).catch(error => console.log('error', error))
  }


}

</script>

<style scoped lang="scss">




.button {
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}
.button.loading {
  min-width: 54px;
  height: 54px;
  padding: 0;
}

</style>
