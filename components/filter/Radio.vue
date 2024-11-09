<template>
     <div class="input-block c-4" :class="error ? 'error' : ''">
            <label class="p-small" :class="required && 'required'" :for="name">{{ title }}</label>
            <p :v-if="subtitle" class="p-small subtitle">{{ subtitle }}</p>
            <div class="list">
                <FilterRadioButton
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                :name="item.name"
                :title="item.title"
                :modelValue="modelValue"
                @select="$emit('update:modelValue', $event)"
                />
            </div>
            <label :for="name" class="error-message">{{ errorText }}</label>
          </div>
</template>

<script setup>
defineProps({
    name: {
        type: String,
        required: true,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    modelValue: {
        type: String,
        required: true,
        default: ''
    },
    error: {
        type: Boolean,
        default: false
    },
    errorText: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    subtitle: {
        type: String,
        default: ''
    }
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.list {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.subtitle {
    font-style: italic;
    margin: 8px 0;
}
</style>