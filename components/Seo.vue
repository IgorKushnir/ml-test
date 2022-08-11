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

const translations = useTranslationsData();

const fullPath = useRoute().fullPath;
const siteUrl = "https://millanova.com" + fullPath


const title =
    props.data?.seo?.metaTitle ??
    props.data?.title ??
    props.title ??
    translations.value.site_title;
const description =
    props.data?.seo?.metaDescription ??
    props.data?.text ??
    props.data?.description ??
    translations.value.site_description;

const ogImageUrl = 'https://millanova.com/img/og-image.jpg'



    function setSeo() {
  useHead({
    title: title,
    titleTemplate: (title) => `${ title } - ${ description }`,
    link: [
      { rel: 'canonical', href: siteUrl}
    ],
    meta: [
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:site_name', content: 'Milla Nova' },
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'website' },
      { property: 'og:description', content: description },
      { property: 'og:url', content:  siteUrl },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:image', content: ogImageUrl },
      { property: 'twitter:image', content: ogImageUrl },


      { hid: 'description', name: 'description', content: description }

    ],
    htmlAttrs: [
      {prefix: "og: http://ogp.me/ns#"}
    ]
  })
}
watch(() => props.data, () => {
  setSeo()
})

setSeo()
</script>

<style scoped>

</style>
