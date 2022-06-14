<template>
  <div class="list-icon">
    <span :class="'icon-'+icon"/>
    <div>
      <NuxtLink :to="to" :target="target" class="list-container p-small link">
        {{text}}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: false,
    default: 'bullet-16'
  },
  text: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: false,
  },
  target: {
    type: String,
    required: false,
    default: '_self'
  }
})

</script>

<style scoped lang="scss">
.list-icon {
  display: flex;
  *:first-child {
    margin-right: 16px;
  }
  .list-container {
    max-width: calc(100% );
    *:first-child {
      margin-top: -2px;
    }
  }
}
.link {
  display: block;
  overflow-wrap: anywhere;
  word-break: break-word;

}


</style>
