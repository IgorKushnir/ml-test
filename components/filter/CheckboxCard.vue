<template>
    <div class="wrap" :class="{ active: modelValue.includes(value) }" @click="update">
        <p class="text">{{ title }}</p>
        <div v-if="modelValue.includes(value)" class="checkmark"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    value: String,
    modelValue: Array
})

const emits = defineEmits(['select'])

const update = () => {
  emits('select', props.value)
}
</script>

<style lang="scss" scoped>
.wrap {
    flex-basis: calc(50% - 10px);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $light-gray;
    border: 1px solid transparent;
    cursor: pointer;

    &.active {
        background-color: white;
        border-color: $dark-blue;
    }
}

.text {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
}

.active {
    & .text {
        font-weight: 500;
    }
}

.checkmark {
    width: 20px;
    height: 8px;
    border-bottom: 1px solid $dark-blue;
    border-left: 1px solid $dark-blue;
    transform: rotateZ(-45deg);
}

</style>