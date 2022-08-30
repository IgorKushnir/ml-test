<template>
  <div class="list-icon">
    <span :class="'icon icon-'+icon"/>
    <div>
      <NuxtLink :to="to" :target="target" class="list-container p-small">
        <div class="text"><slot /></div>

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
}
.icon, text {
  margin-left: 8px;
}
.text {
  margin-left: 16px;

  display: block;
  overflow-wrap: anywhere;
  word-break: break-word;
  font-weight: inherit;
}


</style>
