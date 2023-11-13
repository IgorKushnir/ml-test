<template>
  <div>
<!--    <pre>{{localizations}}</pre>-->
<!--    <pre>{{route.meta.nuxtI18n}}</pre>-->
    <SeoText v-if="seoText || data?.seo?.seoText" :html="seoText || data?.seo?.seoText"/>
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
  breadcrumbs: {
    type: Array,
    required: false
  },
  blockRobots: {
    type: Boolean,
    required: false,
    default: false
  },
  description: {
    type: String,
    required: false
  },
  seoText: {
    type: String,
    required: false
  },
  localizations: {
    type: Array,
  },
  pathToPage: {
    type: Array,
    default: []
  }
})

// *** Lang switcher ***
const route = useRoute();

const { locale, locales } = useI18n()

route.meta.locales = {
  en: {path: "/"},
  pl: {path: "/pl"}
}
route.meta.locales[locale.value] = {path: route.fullPath}
// console.log(route.path);

let isSetLocals = false
watch(() => props.localizations, () => {
  setLocalizations()
})

function setLocalizations() {
  if(props.localizations && !isSetLocals) {
    // isSetLocals = true
    props.localizations.forEach(loc => {
      let _locale = loc.attributes
      if (!_locale) _locale = loc

      const _path = [_locale.locale === "en" ? null : '/'+_locale.locale, ...props.pathToPage, _locale.slug].join('/')
      // console.log({_path});
      route.meta.locales[_locale.locale] = {path: _path}
    })
    // console.log(props.localizations);
  }
}
setLocalizations()


// // Set translations switcher paths
// const langPages = useCurrentLangPages()
// langPages.value = {
//   en: { path: '/' },
//   pl: { path: '/pl/' }
// }



// // Set empty locale roads
// route.meta.nuxtI18n = {}
// locales.value.forEach(loc => {
//   route.meta.nuxtI18n[loc] = {fullPath: '/ddd'}
// })
// // Set current path
// console.log(route.path);
// route.meta.nuxtI18n[locale.value] = route.path

/// ***

const translations = useTranslationsData();

const fullPath = useRoute().fullPath;
const name = useRoute().name;
const site = "https://millanova.com"
const siteUrl = site + fullPath

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

const _title = computed(() => props.data?.seo?.metaTitle ?? parseVariablesInBrackets(translations.value?.seo_pattern[patternIndex.value]?.title) ?? 'Milla Nova');
const _description = computed(() =>  props.description ?? props.data?.seo?.metaDescription ?? parseVariablesInBrackets(translations.value?.seo_pattern[patternIndex.value]?.description) ?? '')
// const keywords = computed(() => props.data?.seo?.keywords ??parseVariablesInBrackets( translations.value?.seo_pattern[patternIndex.value]?.keywords) ?? '')

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

  // Breadcrumbs
  if (props.breadcrumbs) {
    let breadcrumbs = [
      {
        title: 'Milla Nova',
        path: '/'
      },
      ...props.breadcrumbs
    ]

    breadcrumbs = breadcrumbs.map((b, index) => {
      let res = {
        "@type": "ListItem",
        "position": index + 1,
        "name": b.title,
      }
      if (b.path) res.item = site + b.path
      return res
    })

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [...breadcrumbs]
          }),
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
          text = props.title ?? props.data[variable]
        } else {
          if (typeof props.data[variable]?.data?.attributes?.title === 'string') text = props.title ?? props.data[variable]?.data?.attributes?.title;
        }
      } else {
        if (props.title) {
          text = props.title
        } else {
          str = null
        }
      }

      if (str) str = str.replace('['+variable+']', text)
    })
  }

  return str;
}

function setSeo() {
  useHead({
    title: _title,
    link: [
      {rel: 'canonical', href: siteUrl}
    ],
    meta: [
      {property: 'og:locale', content: 'en_US'},
      {property: 'og:site_name', content: 'Milla Nova'},
      {property: 'og:title', content: _title},
      {property: 'og:type', content: 'website'},
      {property: 'og:description', content: _description},
      {property: 'og:url', content: siteUrl},
      {property: 'twitter:card', content: 'summary_large_image'},
      {property: 'og:image', content: ogImageUrl},
      {property: 'twitter:image', content: ogImageUrl},


      {hid: 'description', name: 'description', content: _description},
      // {hid: 'keywords', name: 'keywords', content: keywords},


      {name: 'robots', content: props.blockRobots ? "noindex, nofollow" : "index, follow"},

    ],
    htmlAttrs: [
      {prefix: "og: http://ogp.me/ns#"}
    ]
  })
}

// watch(() => props.data, () => {
//   setSeo()
// })

setSeo()




// const router = useRouter();
// const route = useRoute();

// router.beforeEach((to, from) => {
//   if (to.fullPath === '/silhouette/a-line') {
//     console.log('1');
//     router.replace('/dress?silhouettes=a-line')
//   }
//
// });
//
// router.afterEach((to, from) => {
//   if (to.fullPath === '/dress?silhouettes=a-line') {
//     console.log('2');
//     window.history.replaceState('', '', '/silhouette/a-line');
//   }
// })
//
//

// onMounted(() => {
//   if (route.fullPath === '/silhouette/a-line') {
//     console.log('0');
//     router.replace('/dress?silhouettes=a-line')
//   }
// })
</script>

<style scoped>

</style>
