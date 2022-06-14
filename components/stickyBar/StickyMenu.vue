<template>
  <div>
    <NuxtLink
        v-for="item in data"
        :to="path + item.slug"
        class="nav-link hover"
    >{{ item.title }}</NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  path: {
    type: String,
    required: false,
    default: ''
  }
})

</script>

<style scoped lang="scss">
.nav-link {
  display: inline-block;
  margin: 22px 20px;
}

.nav-link:first-child {
  margin-left: 0;
}
.nav-link:last-child {
  margin-right: 0;
}

.nav-link.router-link-active {
  font-weight: bold;
}
.nav-link:after {
  content: '';
  position: absolute;
  top: 39px;
  left: 50%;
  height: 1px;
  width: 0;
  background-color: $dark-blue;
  transition: .3s;
}

.nav-link.router-link-active:after {
  height: 2px;
  width: 100%;
  left: 0;
}

@media (hover: hover) {
  .nav-link:hover:after {
    top: 40px;
    left: 0;
    height: 1px;
    width: 100%;
  }
}


@include md {
  .nav-link {
    margin: 18px 12px;
  }
  .nav-link:last-child {
    margin-right: 32px;
  }
}

</style>
