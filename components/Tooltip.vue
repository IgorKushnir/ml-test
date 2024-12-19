<template>
    <div class="tooltip-wrap">
        <img class="tooltip-icon" src="@/assets/img/info.svg" />
        <div class="tooltip-popup">
            <img class="tooltip-popup__icon" src="@/assets/img/info-grey.svg" />
            <p class="tooltip-popup__text">
                {{ text }}
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: ''
    }
})
</script>

<style lang="scss" scoped>

.tooltip-wrap {
    position: relative;
}

.tooltip-icon {
    background-image: none;
    cursor: pointer;
    width: 12px;
    height: 12px;
    
    &:hover {
        & + .tooltip-popup {
            opacity: 1;
        }    
    }
}

.tooltip-popup {
    position: absolute;
    bottom: 14px;
    left: 14px;
    padding: 8px;
    width: 204px;
    height: auto;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    border: 0.25px solid $dark-blue;

    &__icon {
        width: 12px;
        height: 12px;
        padding-top: 2px;
        background-image: none;
    }

    &__text {
        margin: 0;
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;  
        text-transform: none;  
        color: $dark-blue;
    }
}
</style>