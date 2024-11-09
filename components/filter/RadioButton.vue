<template>
            <div class="radio-button-container" :class="modelValue === value && 'active'" @click="update">
            <input
                :value="value"
                class="radio"
                type="radio"
                :name="name"
                :id="name"
            />
            <label class="label" :for="name">{{ title }}</label>
          </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
    default: '',
  },
  value: {
    type: String,
    required: true,
    default: '',
  },
  modelValue: {
    type: String,
    required: true,
    default: '',
  },
})

const emits = defineEmits(['select'])

const update = () => {
  emits('select', props.value)
}
</script>

<style scoped lang="scss">
.radio-button-container {
  cursor: pointer;
}

.radio {
  appearance: none;
  width: 24px;
  height: 24px;
  position: relative;
}

.radio:after {
  content: '';
  width: 24px;
  height: 24px;
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  border: 1px solid $border-dark;
  cursor: pointer;
}

.label {
  display: inline;
  vertical-align: super;
  margin-left: 16px;
  color: $dark-blue;
  cursor: pointer;
}

.active {
  .radio:after {
    background-color: $light-gray;
    border: 6px solid $blue;
  }

  .label {
    font-weight: bold;
  }
}

@media (hover: hover) {
  .radio-button-container:hover {
    .radio:after {
        background-color: $light-gray;
        border: 6px solid $blue;
    }
  }
  .radio-button-container.box:hover {
    .radio:after {
        background-color: $light-gray;
        border: 6px solid $blue;
    }
  }
}

</style>