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
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  }
})
const defaultTitle = ref('Milla Nova')

const translations = useTranslationsData();

const fullPath = useRoute().fullPath;
const url = "https://millanova.com" + fullPath


const title = props.data?.seo?.metaTitle ?? props.data?.title ?? props.title ?? defaultTitle.value;
const description = props.description ?? "millanova.com";

const ogImageQuery = new URLSearchParams({
  description: description,
  title: title,
  image: props.image,
});

function setSeo() {
  useHead({
    title: title,
    titleTemplate: (title) => `${title} - ${translations.value.site_title}`,
    link: [
      { rel: 'canonical', href: url}
    ],
    meta: [
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: 'en_US' },
      { property: 'og:description', content: description },
      { property: 'og:url', content: "http://159.223.121.185/?" + ogImageQuery  },
      { property: 'twitter:card', content: 'summary_large_image' },

      { hid: 'description', name: 'description', content: description }

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
