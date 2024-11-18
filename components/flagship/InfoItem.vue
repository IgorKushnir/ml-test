<template>
    <li class="text-item" :class="{'text-item--active': isOpen}" @click="isOpen = !isOpen">
        <div class="text-item-header">
            <h6 class="text-item-header__title">
              {{ title }}
            </h6>
            <div class="text-item-header__arrow" />
        </div>
        <div class="text-item__block"><div><slot></slot></div></div>
          </li>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    },
})

const isOpen = ref(false)
</script>

<style scoped lang="scss">
.text-item-header {
    display: none;
    transition: all 0.25s;

    &__title {
        text-transform: uppercase;
        font-size: 16px;
        margin: 0;
        font-weight: 400;
        transition: all 0.25s;
    }

    &__arrow {
        display: none;
        width: 6px;
        height: 6px;
        border-right: 1px solid $dark-blue;
        border-bottom: 1px solid $dark-blue;
        transform: rotate(45deg);
        transition: all 0.25s;
    }
}

.text-item {
  flex-basis: 48%;
  padding-top: 24px;
  border-top: 1px solid $border-dark;
  color: $gray;
  font-weight: 400;
  font-size: 18px;
  transition: all 0.25s;

  &:last-of-type {
    border-bottom: 1px solid $border-dark;
  }

  &__block {
    padding-left: 30px;
    margin-bottom: 0px;
    display: grid; 
    grid-template-rows: 1fr;
    transition: 500ms all ease;
    
    & > div {
        overflow: hidden;
  }
  }

  &--active {
    border-top: 1px solid $blue;
    border-bottom: 1px solid $blue;
    transition: all 0.25s;

    &:last-of-type {
    border-bottom: 1px solid $blue;
  }

    .text-item-header__title {
        font-weight: 600;
    }

    .text-item-header__arrow {
        transform: rotate(225deg);
    }

    .text-item__block {
        grid-template-rows: 1fr;
        margin-bottom: 20px;
    }

    & + .text-item {
        border-top: 1px solid transparent;
    }
  }
}



@include lg {
.text-item {
  padding-top: 0;
  flex-basis: 100%;

  &__block {
    grid-template-rows: 0fr;
  }
}

.text-item-header {
    padding: 20px 0;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    &__arrow {
        display: block;
    }
}
}
</style>