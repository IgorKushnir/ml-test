<template>
  <div>
    <div v-if="data != null && !pending">

      <StickyBarStickyHeaderMilla :title="collection ?  $t('back_to_collection') : data.title" @onBackClick="onBackClick">
        <template #end>
          <StickyBarBack v-if="data?.extra?.previous" reverse :text="$t('previous')" @clicks="prevHandler"/>
          <StickyBarBack v-if="data?.extra?.next" :text="$t('next')" @click="nextHandler"/>
        </template>
      </StickyBarStickyHeaderMilla>


      <div class="promo ratio-3x4 show-md">
        <Image
            v-if="data?.gallery?.data?.length > 0 && data.gallery.data[0]"
            :path="{data: data.gallery.data[0]}"
            :alt="`${data.title} ${data?.type?.data?.attributes?.title}`"
            :class="discontinued ? 'discontinued' : ''"
        />
        <div class="white-overlay"></div>
      </div>

      <Container>

        <div class="col-4 col-5-lg col-12-md">
          <div class="title-container">
            <h1 class="title m-t-0">{{ data.title }}</h1>
            <LikeButton v-if="!discontinued" :liked="liked" @click="handleLike(data.id)"/>
          </div>

          <div v-if="discontinued" class="p-h-12 p-v-8 light_bg inline">{{ $t('discontinued') }}</div>


          <div class="sticky-content">
<!--            <div v-if="discontinued" class="badge light_bg p-h-16 p-v-8 gray">Discontinued</div>-->
            <p class="m-b-32" v-if="data?.description" v-html="$handleNewLine(data.description)" />


            <div class="info m-t-40" v-if="data?.collection?.data">
              <div class="m-b-32 m-r-40">
                <div class="subheader small">{{ $t('collection') }}</div>
                <NuxtLink :to="localePath(`/collection/${data.collection.data?.attributes?.slug}`)" class="p-small link">{{ data.collection.data?.attributes?.title }}</NuxtLink>
              </div>
              <div class="m-b-32">
                <div class="subheader small">{{ $t('line') }}</div>
                <div class="p-small dark-blue">
                  {{ data.collection.data?.attributes?.line?.data?.attributes?.title }}
                </div>
              </div>
            </div>


            <div v-if="data?.colors?.data?.length > 0" class="info m-b-32  m-b-16-md">
              <div>
                <div class="subheader small">{{ $t('color') }}</div>
                <div class="p-small">
                  <template v-for="(color, index) in data.colors.data">
                    <NuxtLink :to="data?.type?.data?.attributes?.slug === 'dress' ? localePath(`/${(data?.type?.data?.attributes?.slug)}/${routeLocalization[locale].colors}/${color?.attributes?.slug}`) : ''" class="p-small link">{{ color?.attributes?.title }}</NuxtLink><span v-if="index + 1 < data.colors.data?.length">, </span>
                  </template>
                </div>
              </div>
            </div>

            <div v-if="data?.silhouettes?.data" class="info m-b-32  m-b-16-md">
              <div>
                <div class="subheader small">{{ $t('silhouette') }}</div>
                <div class="p-small">
                  <NuxtLink :to="data?.type?.data?.attributes?.slug === 'dress' ? localePath(`/${(data?.type?.data?.attributes?.slug)}/${routeLocalization[locale].silhouettes}/${data.silhouettes.data.attributes.slug}`) : ''" class="p-small link">{{ data.silhouettes.data?.attributes?.title }}</NuxtLink>
                </div>
              </div>
            </div>

            <div v-if="data.fabrics?.data?.length > 0" class="info m-b-32  m-b-16-md">
              <div>
                <div class="subheader small">{{ $t('fabric') }}</div>
                <div class="p-small">
                  <template v-for="(fabric, index) in data.fabrics.data">
                    <NuxtLink :to="data?.type?.data?.attributes?.slug === 'dress' ? localePath(`/${(data?.type?.data?.attributes?.slug)}/${routeLocalization[locale].fabrics}/${fabric.attributes.slug}`) : ''" class="p-small link">{{ fabric.attributes.title }}</NuxtLink><span v-if="index+1 < data.fabrics.data?.length">, </span>
                  </template>
                </div>
              </div>
            </div>



            <div v-if="data.properties?.length > 0" class="info extra">
              <div v-for="property in data.properties" class="m-b-32 m-b-16-md">
                <div class="subheader small">{{ property.title }}</div>
                <div v-if="property.level" class="p-small dark-blue m-b-4 starts">
                  {{ getStars(property.level) }}

                </div>
                <div v-if="property.description" class="p-small dark-blue">
                  {{ property.description }}
                </div>
              </div>
            </div>

            <div v-if="data?.trunk_shows?.data?.length > 0" class="info extra">
              <div class="m-b-32 m-b-16-md">
                <div class="subheader small subheader--flex">{{$t('trunk_shows')}} <Tooltip :text="$t('product_trunk_show_tooltip')" /></div>
                <div v-for="show in data?.trunk_shows?.data" class="trunk-show-preview-container m-b-4">
                  <div class="trunk-show-preview"><Image :path="show.attributes.cover_4x3"/></div>
                  <div>
                    <NuxtLink  :to="localePath('/trunk-shows/'+show.attributes.slug)" class="p-small link dark-blue m-b-4">
                      {{ `${show.attributes.title}, ${show.attributes.country}, ${show.attributes.city}, ${$getDatesInRange(show.attributes.from, show.attributes.to, $getMonths, true)}` }}
                    </NuxtLink>
                  </div>
                </div>


              </div>
            </div>


            <NuxtLink v-if="data.storeLink" :to="localePath(data.storeLink)" target="_blank" class="button m-t-16 m-t-0-md m-b-24-md m-r-16 target">{{$t('buy_online')}}</NuxtLink>
            <NuxtLink v-if="!discontinued"  :to="locale === 'pl' ? localePath('/warszawa') : `${localePath('/request-an-appointment')}?source=${data?.collection?.data?.attributes?.slug ?? 'null'}`" target="_self" style="width: 100%;" class="button w-full m-t-16 m-t-0-md m-b-24-md">
              {{ locale === 'pl' ? $t('book_an_appointment') : $t('request_an_appointment') }}</NuxtLink>


          </div>
        </div>


        <ContentMediaGrid
            :data="data.gallery.data" :alt="`${data.title} ${data?.type?.data?.attributes?.title}`"
            :hide-first="isMobile"
            :zoom="true"
            classes="col-8 col-7-lg col-12-md m-t-0"
            :discontinued="discontinued"
            columns="product">
          <template #end >
            <div v-if="data.fact !== null" :class="data.fact.ratio">
              <div :class="data.fact.ratio === 'horizontal' ? 'new-ratio-3x2' : 'new-ratio-3x4'">
                <Fact :data="data.fact"/>
              </div>
            </div>
          </template>
        </ContentMediaGrid>



      </Container>

      <Carusel v-if="data.recommended !== null && data.recommended?.products?.data?.length > 0" :data="data.recommended?.products.data" :column="discontinued ? 6 : 4" class="m-v-80">
        <h2 v-if="!discontinued" class="m-t-0 m-b-40 m-b-24-md">{{ $t('complete_your_look') }}</h2>
        <h2 v-if="discontinued" class="m-t-0 m-b-40 m-b-24-md">{{ $t('find_alternatives') }}</h2>
      </Carusel>

      <Carusel v-if="data.extra !== null && data.extra.also?.length > 0 && !discontinued" :data="data.extra?.also"  class="m-v-80">
        <h2 class="m-t-0 m-b-40 m-b-24-md">{{ $t('you_may_also_like') }}</h2>
      </Carusel>

    </div>
    <Loading :pending="pending"/>
    <PageNotFound :show="data == null && !pending"/>
    <Seo
        :data="data"
        :breadcrumbs="breadcrumbs"
        :localizations="data?.localizations?.data"
    />
  </div>
</template>

<script setup lang="js">
import getProduct from '~/api/getProduct'
const { $setViewedProduct, $getViewedProduct, $getLikedProducts, $toggleLikeProduct } = useNuxtApp()
import {useTypesData} from "~/composables/states";
import Image from "../../components/Image";
const isMobile = useIsMobile();
import {routeLocalization} from "~/composables/routeLocalization";

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;
let draft = route.query?.draft;
const collection = route.query?.collection;
const likeList = ref([])

const { locale } = useI18n()
const localePath = useLocalePath()

const onBackClick = () => {
  if (collection) {
    router.push(localePath(`/collection/${collection}`))
  } else {
    router.back()
  }
}

let publicationState = "LIVE";
if (draft === 'true') {
  publicationState = "PREVIEW";
}

const extrudedIds = useViewedProductIds().value;

let {data, pending} = await getProduct(slug, JSON.stringify(extrudedIds), publicationState, locale.value)

const discontinued = computed(() => data.value.discontinued)

// Redirect from not TYPE path
if (process.server) {
  const types = useTypesData()

  const fullPath = route.fullPath;
  let path = fullPath.split('/')
  path = path.filter(p => p !== '' && p !== locale.value)
  path = path[0]

  const index = types.value.findIndex(t => t.slug === path)
  if (index === -1) {

    if (data.value?.type?.data?.attributes?.slug) {

      const redirectLink = ['',data.value?.type?.data?.attributes?.slug, slug].join('/')
      navigateTo(localePath(redirectLink), { redirectCode: 301 })
    }
  }
}


if (process.server) {
  if (data.value) {
    const indexOfFirsImage = data.value?.gallery?.data.findIndex(item => item.attributes.mime.startsWith('image'))
    let structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": data.value.title,
      "description": data.value.description ?? '',
      "brand": {
        "@type": "Brand",
        "name": "Milla Nova"
      }
    }
    if (indexOfFirsImage !== -1) structuredData["image"] = data.value.gallery?.data[indexOfFirsImage]?.attributes?.formats?.medium?.url ?? data.value.gallery?.data[indexOfFirsImage]?.attributes?.url ?? ''

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ]
    })

    if (!indexOfFirsImage && indexOfFirsImage != 0) {
      console.error('Check product error: ', data.value.title, indexOfFirsImage);
    }
  } else {
    console.error(404, route.fullPath);
  }
}


function getLikeList() {
  likeList.value = $getLikedProducts();
}

const liked = computed(() => likeList.value.includes(data.value.id.toString()))
function handleLike(id) {
  $toggleLikeProduct(id)
  getLikeList()
}


function prevHandler() {
  router.push(localePath(`/${data.value.extra.previous.type.slug}/${data.value.extra.previous.slug}${collection ? `?collection=${collection}` : ''}`))
}

function nextHandler() {
  router.push(localePath(`/${data.value.extra.next.type.slug}/${data.value.extra.next.slug}${collection ? `?collection=${collection}` : ''}`))
}


const breadcrumbs = computed(() => {
  let res = [
    {
      title: data?.value?.title,
      path: null
    }
  ]
  if (data?.value?.collection?.data) {
    res = [
      {
        title: data?.value.collection?.data?.attributes?.title,
        path: '/collection/' + data?.value.collection?.data?.attributes?.slug,
      },
        ...res
    ]
  } else {
    if (data?.value?.type?.data) {
      res = [
        {
          title: data?.value.type?.data?.attributes?.title,
          path: '/' + data?.value.type?.data?.attributes?.slug,
        },
        ...res
      ]
    }
  }
  return res;
})

function getStars(level) {
  if (level.startsWith('l')) {
    const amount = level.substring(1);
    let string = ''
    for (let i = 0; i < 5; i++) {
      if (amount > i) {
        string += '★'
      } else {
        string += '☆'
      }
    }
    return string
  }
}

onMounted(() => {
  getLikeList()

  function mount() {
    if (pending.value) {
      setTimeout(() => {
        mount()
      }, 100)
    } else {
      if (data.value?.id) {
        $setViewedProduct(data.value.id)
        const viewedIds = $getViewedProduct()
        useViewedProductIds().value = viewedIds;

        data.value.extra.also = data.value.extra.also.filter(item => {
          return !viewedIds.includes(item.attributes.id.toString())
        });
      }

    }
  }
  mount()
})

</script>

<style scoped lang="scss">


.title-container {
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  .icon-like {
    font-size: 32px;
    height: 48px;
  }
}
.starts {
  letter-spacing: .2em;
}
.info > * {
  display: inline-block;
}

.info.extra > * {
  display: block;
}


.info .subheader.small {
  margin-bottom: 8px;
}

.subheader--flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sticky-content {
  position: sticky;
  top: 104px;
}


.horizontal {
  grid-column: auto/span 2;
}
.vertical {
  grid-column: auto/span 1;
}

.badge {
  display: inline-block;
}

.trunk-show-preview-container {
  display: flex;
  gap: 8px;
  //justify-content: center;
  justify-items: center;

}
.trunk-show-preview {
  width: 24px;
  height: 20px;
  //overflow: hidden;
  position: relative;
  display: inline-block;
}

@include lg {
  .horizontal {
    grid-column: auto/span 1;
  }
}
@include md {
  .sticky-content {
    position: relative;
    top:0
  }

  .promo {
    margin-bottom: -80px;
  }

  .white-overlay {
    height: calc(100% + 1px);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 80%, #FFFFFF 100%);
  }

  .icon-like {
    padding-top: 3px
  }

}


</style>
