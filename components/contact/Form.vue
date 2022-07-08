<template>
  <div>
    {{sendData}}
    <div v-if="item">
      <InnerHeader :title="item.title"/>
      <StickyHeader>
        <template #center>
          <StickyMenu :data="data.entry" path="?" :activeItem="index"/>
        </template>
      </StickyHeader>

      <Container justify="justify-center">
        <form class="col-6 form" @submit.prevent="send">
          <template v-for="(formItem, index) in item.form">
            <div class="input-block" :class="'c-'+formItem.size">
<!--              <label class="p-small" :class="formItem.required ? 'required' : ''">{{ formItem.title }}</label>-->
              {{sendData}}
              <input
                  v-if="formItem.type !== 'textarea'"
                  :autofocus="index === 0"
                  class="input m-t-8"
                  :type="formItem.type"
                  :required="formItem.required"
                  :name="formItem.title"
                  :title="formItem.title"
              />
              <textarea v-if="formItem.type === 'textarea'" :autofocus="index === 0" class="input m-t-8" :required="formItem.required" :name="formItem.title" :title="formItem.title"/>
            </div>
          </template>
          <input type="submit" title="Send" style="display: none"/>
        </form>

      </Container>

    </div>

    <PageNotFound :show="!item"/>
  </div>
</template>

<script setup>
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

function generateData() {
  sendData.value = {}
  item.value.form.forEach(e => {
    sendData.value[e.title] = ''
  })
}
generateData();
watch(index, () => {
  generateData()
})

function send() {
  console.log('send');
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
  padding: 0 24px;
  border-radius: 0;
  width: 100%;
  font-size: 16px;
}
textarea {
  resize: none;
  height: 140px!important;
  padding: 16px 24px!important;
  font-family: inherit;
}
.form {
  display: grid;
  column-gap: 40px;
  row-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
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

</style>
