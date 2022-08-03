<template>
  <div>
<!--    {{data}}-->
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: false
  },
  title: {
    type: String,
    required: false
  }
})
const defaultTitle = ref('Milla Nova')

const translations = useTranslationsData();

function setSeo() {
  useHead({
    title: props.data?.seo?.metaTitle ?? props.data?.title ?? props.title ?? defaultTitle.value,
    titleTemplate: (title) => `${title} - ${translations.value.site_title}`,
    meta: [
      false ? {
        hid: 'description',
        name: 'description',
        content: 'dfdf'
      } : {}
    ],
  })
}
watch(() => props.data, () => {
  setSeo()
})

setSeo()
</script>

<style scoped>

</style>
