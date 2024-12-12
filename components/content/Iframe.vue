<template>
  <div class="container col-8 col-10-xl col-12-lg">
<iframe :src="data.link" width="100%" height="600px" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

</script>