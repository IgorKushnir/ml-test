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
    right: 8vw;
    width: 57px;
    height: 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid #C1C4C7;
    border-radius: 50%;
    cursor: pointer;
    z-index: 98;
    animation: fadeIn 0.5s ease-in-out;

    @media (min-width: 768px) {
      right: 4vw;
    }
}

.icon {
  background-image: unset;
}
</style>