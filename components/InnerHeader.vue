<template>
  <div class="sub-header-container ">
    <div class="container row justify-center">
      <div class="header col-6 col-10-lg col-12-md center">
        <div :class="sub_title || sub_header ? 'wrapper m-v-40 m-v-32-md' : 'wrapper'">

          <h1 class="title">
            <span class="subheader" v-if="sub_header" style="display: block">{{ sub_header }}<br></span>
            {{ title }}</h1>
          <p v-if="sub_title" style="margin: 0 auto">{{ sub_title }}</p>
        </div>
      </div>
    </div>


    <div class="container steps row justify-center m-b-32" v-if="steps">
      <div class="col-4 col-8-xl col-10-lg col-12-md steps-container">
        <template v-for="(step, index) in steps">
          <div
              v-on:click="() => goStep(index)"
              class="step-item" :class="(currentStep === index ? 'active' : '') + (currentStep < index ? ' disable' : '')"><div class="step-point m-b-8">{{index + 1}}</div><div class="p-small center">
            {{ step.name }}</div></div>
          <div v-if="index < steps?.length-1" class="icon-drop-down-16 divider"/>
        </template>

      </div>
    </div>

  </div>


</template>

<script setup lang="js">
const emits = defineEmits(['step'])
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  sub_title: {
    type: String,
    required: false
  },
  sub_header: {
    type: String,
    required: false
  },
  steps: {
    type: Object,
    required: false
  },
  currentStep: {
      type: Number,
      default: 0
    },

})

function goStep(index) {
  if (props.currentStep > index) {
    props.steps.forEach(step => {
      step.active = false
    })
    props.steps[index].active = true
    emits('step', index)
  }

}

</script>

<style scoped lang="scss">


.header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.sub-header-container {
  border-bottom: 1px solid $border-dark;
  .container {
    min-height: 152px;

  }
  .steps {
    min-height: 0;
  }
}
.wrapper > *:first-child{
  margin-top: 0;
}
.wrapper > *:last-child{
  margin-bottom: 0;
}

.steps-container {
  display: flex;
  justify-content: space-around;
}

.step-point {
  width: 56px;
  height: 56px;
  background-color: $white;
  border: 1px solid $border-dark;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0 auto;
}

.step-item {
  cursor: pointer;
  width: 80px;
  line-break: auto;
  text-align: center;
}
.step-item:hover {
  .step-point {
    background-color: $light-gray;
    border-color: $gray;
  }

}
.step-item.active {
  font-weight: bold;
  .step-point {
    background-color: $dark-blue;
    color: $white;
    border: unset;
  }
}
.step-item.disable {
  color: rgba($gray, 0.3);
  cursor: unset;
  .step-point {
    background-color: $light-gray;
    color: rgba($gray, 0.3);
    border: unset;
  }
}
.divider {
  align-self: center;
  margin-bottom: 16px;
  transform: rotate(-90deg);
  color: $border-dark;
}

@include md {
  .sub-header-container {
    .container {
      min-height: 112px;
    }
  }
}

</style>
