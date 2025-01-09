<template>
        <div class="wrap" @click="scrollToTop">
            <img class="icon" src="@/assets/img/pointer-up.svg" />
        </div>
</template>

<script setup>
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.wrap {
    position: fixed;
    bottom: 60px;
    right: 220px;
    width: 57px;
    height: 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-right-width: 3px;
    border-left-width: 3px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    animation: fadeIn 0.5s ease-in-out;
}
</style>