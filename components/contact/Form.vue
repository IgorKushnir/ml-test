<template>
  <div>
    <div v-if="item">
      <InnerHeader :title="item.title"/>
      <StickyHeader>
        <template #center>
          <StickyMenu :data="data.entry" path="?" :activeItem="index"/>
        </template>
      </StickyHeader>


      <transition name="fade">

        <Container justify="justify-center" v-if="!sent">
          <form class="col-6 form" @submit.prevent="send">
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
                <transition name="fade">
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
const apiUrl = config.STRAPI_URL;

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
      console.log(res);
      sent.value = true;
    }).catch(error => console.log('error', error))
  }


}

</script>

<style scoped lang="scss">
label.required:after {
  content: " *";
  color: $red;
}
.input {
  display: block;
  height: 48px;
  background-color: $light-gray;
  border: unset;
  padding: 0 16px;
  border-radius: 0;
  width: 100%;
  font-size: 16px;
  transition: .3s;
}
.input:disabled {
  background-color: $border-dark;
}
textarea {
  resize: none;
  height: 140px!important;
  padding: 16px!important;
  font-family: inherit;
}
.form {
  display: grid;
  column-gap: 40px;
  row-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
}
.form *:first-child .subheader{
  margin-top: 0!important;
}

.c-1 {
  grid-column: auto/span 1;
}
.c-2 {
  grid-column: auto/span 2;
}
.c-3 {
  grid-column: auto/span 3;
}
.c-4 {
  grid-column: auto/span 4;
}

.error-message {
  display: none;
}
.error {
  .input {
    border: 1px solid $red;
  }
  .error-message {
    display: unset;
    font-size: 13px;
    color: $red;
    margin-top: 8px;
  }
}


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
