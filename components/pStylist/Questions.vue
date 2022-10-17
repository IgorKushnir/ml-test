<template>
  <Container justify="justify-center" style="margin-bottom: 0!important;">
    <div class="col-10 p-b-0">
      <div class="subheader center gray">{{ data.title }}
        <div class="counter">
          <CircleProgress
              size="72"
              fill-color="#051C2C"
              empty-color="#D7DBDD"
              border-width="2"
              border-bg-width="1"
              :percent="100 / (data.questions.length + 1) * (index + 1)"
          />
          <span>{{ index + 1 + '/' + data.questions.length }}</span>
        </div>
        <!--        <span class="counter"></span>-->
      </div>
    </div>
  </Container>

  <Container justify="justify-center" style="margin-top: 0!important;">


    <transition-group name="slider">
      <div class="col-6 col-8-xl col-10-lg col-12-md p-t-8" v-for="(question, i) in data.questions" v-show="index === i"
           :key="i">

        <div class="h2 center">{{ question.question }}</div>
        <!--      <div class="h2 center">{{ data.questions[index].__typename }}</div>-->

        <template v-if="question['__typename'] === 'ComponentPersonalStylistQuestion'">
          <div class="m-t-56">
            <div v-for="option in question.option_text">
              <FilterCheckBox
                  :label="option.title"
                  :value="option.value ?? false"
                  @value="() => {
                    option.value = !option.value
                    if (isSingle(question)) continueHandle(question)
                  }"
                  :available="true"
                  box
                  :single="question.select_text === 'single'"
              />
            </div>
          </div>

          <div class="button-container m-t-32">
            <div class="button primary" :class="!isOptionSelected(question) ? 'disable' : ''" v-if="!isSingle(question)"
                 v-on:click="continueHandle(question)">Continue
            </div>
          </div>
        </template>

        <template v-if="question['__typename'] === 'ComponentPersonalStylistPhotoQuestion'">
          <div class="m-t-56 photo-questions-grid">
            <div v-for="option in question.option_photo">
              <FilterCheckBoxPhoto
                  :label="option.title"
                  :value="option.value ?? false"
                  @value="() => {
                    option.value = !option.value
                    if (isSingle(question)) continueHandle(question)
                  }"
                  :available="true"
                  :single="question.select_photo === 'single'"
                  :image="option.cover_3x4"
              />
            </div>
          </div>

          <div class="button-container m-t-32">
            <div class="button primary" :class="!isOptionSelected(question) ? 'disable' : ''" v-if="!isSingle(question)"
                 v-on:click="continueHandle(question)">Continue
            </div>
          </div>
        </template>


      </div>


    </transition-group>
  </Container>
</template>

<script setup>
import Container from "../Container";
// import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
// const api = {
//   get() {
//     return this.request()
//   },
//   request() {
//     return 1
//   }
// }
// api.request()
const index = ref(0)

// const question = computed(() => props.data.questions[index.value])

function isSingle(question) {
  return (question.select_text ?? question.select_photo) === 'single'
}

function isOptionSelected(question) {
  const options = question.option_photo ?? question.option_text;
  const lengthOfTrue = options.filter(option => option.value)

  return lengthOfTrue.length > 0
}

function continueHandle(question) {
  // Check if at least one option selected
  if (!isOptionSelected(question)) return;

  if (index.value === props.data.questions.length - 1) {
    index.value = 0;
    return
  }
  index.value = index.value + 1


  return;
  window.scrollTo({
    top: 153,
    // behavior: "smooth"
  })
}

</script>

<style scoped lang="scss">
.subheader {
  position: relative;
}

.counter {
  position: absolute;
  right: 0;
  top: -28px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  //border: 1px solid $border-dark;
  //border-radius: 50%;
}

.vue3-circular-progressbar {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
}

.button-container {
  width: 100%;
  text-align: center;
}


.photo-questions-grid {
  display: grid;
  align-items: stretch;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@include xl {
  .subheader {
    position: static;
  }
  .counter {
    width: 56px;
    height: 56px;
    top: -4px;
  }
}

@include sm {
  .photo-questions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

.slider-enter-active,
.slider-leave-active {
  transition: .5s ease-out;
  position: absolute;
}

.slider-enter-active {
  position: relative;
  opacity: 0;
}

.slider-enter-from,
.slider-leave-to {
  opacity: 0;
  transform: scale(.8);
}


//.slider-enter-active,
//.slider-leave-active {
//  transition: opacity 0.5s ease;
//  opacity: 0;
//  position: absolute;
//}
//
//.slider-enter-from,
//.slider-leave-to {
//  opacity: 0;
//  position: relative;
//}
</style>
