<template>
<!--      <pre>-->
<!--      {{ patternIndex }}-->
<!--      {{ title }}-->
<!--      {{ description }}-->
<!--      {{ keywords }}-->
<!--      </pre>-->
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
  // description: {
  //   type: String,
  //   required: false
  // },
  // image: {
  //   type: String,
  //   required: false
  // }
})

const translations = useTranslationsData();

const fullPath = useRoute().fullPath;
const name = useRoute().name;
const siteUrl = "https://millanova.com" + fullPath

const patternIndex = computed(() => {
  let index = translations.value.seo_pattern.map((item) => {
    const listOfItems = item.name.split(',').map(el => el.replace(/^\s+|\s+$/gm, ''));
    return listOfItems.includes(name)
  }).findIndex(e => e)

  if (index === -1) {
    index = translations.value.seo_pattern.findIndex(el => el.name === '*')
  }
  return index === -1 ? null : index
})

const title = computed(() => props.data?.seo?.metaTitle ?? parseVariablesInBrackets(translations.value?.seo_pattern[patternIndex.value]?.title) ?? 'Milla Nova');
const description = computed(() => props.data?.seo?.metaDescription ?? parseVariablesInBrackets(translations.value?.seo_pattern[patternIndex.value]?.description) ?? '')
const keywords = computed(() => props.data?.seo?.keywords ??parseVariablesInBrackets( translations.value?.seo_pattern[patternIndex.value]?.keywords) ?? '')

const ogImageUrl = 'https://millanova.com/img/og-image.jpg'

// Add structured data
if (process.server) {
  if (props.data?.seo?.structuredData) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(props.data?.seo?.structuredData),
        },
      ]
    })
  }
}


function parseVariablesInBrackets(str) {
  if (!str) return null;

  const regexp = /\[.*?\]/g
  let variables = str.match(regexp)

  if (variables && variables.length > 0) {
    variables = variables.map(el => el.replace('[', '').replace(']', ''))

    variables.forEach(variable => {
      let text = '['+variable+']'
      if (props.data && props.data[variable]) {
        if (typeof props.data[variable] === 'string') {
          text = props.data[variable]
        } else {
          if (typeof props.data[variable]?.data?.attributes?.title === 'string') text = props.data[variable]?.data?.attributes?.title;
        }
      } else {
        if (!props.title) return null
        text = props.title
      }

      str = str.replace('['+variable+']', text)

    })
  }
  return str;
}

function setSeo() {
  useHead({
    title: title,
    link: [
      {rel: 'canonical', href: siteUrl}
    ],
    meta: [
      {property: 'og:locale', content: 'en_US'},
      {property: 'og:site_name', content: 'Milla Nova'},
      {property: 'og:title', content: title},
      {property: 'og:type', content: 'website'},
      {property: 'og:description', content: description},
      {property: 'og:url', content: siteUrl},
      {property: 'twitter:card', content: 'summary_large_image'},
      {property: 'og:image', content: ogImageUrl},
      {property: 'twitter:image', content: ogImageUrl},


      {hid: 'description', name: 'description', content: description},
      {hid: 'keywords', name: 'keywords', content: keywords}

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
