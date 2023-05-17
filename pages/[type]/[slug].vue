<template>
  <div>
    <Seo :data="data" :breadcrumbs="breadcrumbs"/>

    <div v-if="data != null">

      <StickyHeader :title="data.title">
        <template #end>
          <StickyBarBack v-if="data.extra.previous" reverse text="Previous" @clicks="prevHandler"/>
          <StickyBarBack v-if="data.extra.next" text="Next" @click="nextHandler"/>
        </template>
      </StickyHeader>



      <div class="promo ratio-3x4 show-md">
        <Image :path="{data: data.gallery.data[0]}" :alt="data.title + ' ' + data?.type?.data?.attributes?.title"/>
        <div class="white-overlay"></div>
      </div>
      <Container>

        <div class="col-4 col-5-lg col-12-md">
          <div class="title-container">
            <h1 class="title m-t-0">{{ data.title }}</h1>
            <LikeButton :liked="liked" @click="handleLike(data.id)"/>
          </div>
          <div class="sticky-content">
            <p class="m-b-32" v-if="data.description" v-html="$handleNewLine(data.description)" />


            <div class="info m-t-40" v-if="data.collection.data">
              <div class="m-b-32 m-r-40">
                <div class="subheader small">Collection</div>
                <NuxtLink :to="'/collection/'+data.collection.data.attributes.slug" class="p-small link">{{ data.collection.data.attributes.title }}</NuxtLink>
              </div>
              <div class="m-b-32">
                <div class="subheader small">Line</div>
                <div class="p-small dark-blue">
                  {{ data.collection.data.attributes.line.data.attributes.title }}
                </div>
              </div>
            </div>

            <div v-if="data.colors.data.length > 0" class="info m-b-32">
              <div>
                <div class="subheader small">Color</div>
                <div class="p-small">
                  <template v-for="(color, index) in data.colors.data">
                    <NuxtLink :to="'/'+data.type.data.attributes.slug+'?colors='+color.attributes.slug" class="p-small link">{{ color.attributes.title }}</NuxtLink><span v-if="index+1 < data.colors.data.length">, </span>
                  </template>
                </div>
              </div>
            </div>

            <div v-if="data.properties.length > 0" class="info">
              <div v-for="property in data.properties" class="m-b-32 m-r-16">
                <div class="subheader small">{{ property.title }}</div>
                <div v-if="property.description" class="p-small dark-blue">
                  {{ property.description }}
                </div>
              </div>
            </div>

            <NuxtLink v-if="data.storeLink" :to="data.storeLink" target="_blank" class="button m-t-16 m-t-0-md m-b-24-md target">Buy online</NuxtLink>
            <NuxtLink  to="/book-an-appointment" target="_self" class="button m-t-16 m-t-0-md m-b-24-md">Book an appointment</NuxtLink>
          </div>
        </div>


        <ContentMediaGrid :data="data.gallery.data" :alt="data.title + ' ' + data?.type?.data?.attributes?.title" :hide-first="isMobile" classes="col-8 col-7-lg col-12-md m-t-0" columns="product">
          <template #end >
            <div v-if="data.fact !== null" :class="data.fact.ratio">
              <div :class="data.fact.ratio === 'horizontal' ? 'new-ratio-3x2' : 'new-ratio-3x4'">
                <Fact :data="data.fact"/>
              </div>
            </div>
          </template>
        </ContentMediaGrid>



      </Container>


      <Carusel v-if="data.recommended !== null" :data="data.recommended?.products.data" :column="4" class="m-v-80">
        <h2 class="m-t-0 m-b-40 m-b-24-md">Complete your look</h2>
      </Carusel>
      <Carusel v-if="data.extra !== null && data.extra.also.length > 0" :data="data.extra?.also"  class="m-v-80">
        <h2 class="m-t-0 m-b-40 m-b-24-md">You may also like</h2>
      </Carusel>




    </div>
    <Loading :pending="pending"/>
    <PageNotFound :show="data == null && !pending"/>
  </div>
</template>

<script setup lang="ts">
import getProduct from '~/api/getProduct'
const { $setViewedProduct, $getViewedProduct, $getLikedProducts, $toggleLikeProduct } = useNuxtApp()
const isMobile = useIsMobile();

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;
let draft = route.query?.draft;
const likeList = ref([])

let publicationState = "LIVE";
if (draft === 'true') {
  publicationState = "PREVIEW";
}

const extrudedIds = useViewedProductIds().value;

let {data, pending, refresh, error} = await getProduct(slug, JSON.stringify(extrudedIds), publicationState)

if (process.server) {
  if (!error.value && data.value) {
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


onMounted(() => {
  getLikeList()

  refresh().then(_ => {
    $setViewedProduct(data.value.id)

    const viewedIds = $getViewedProduct()

    useViewedProductIds().value = viewedIds;

    data.value.extra.also = data.value.extra.also.filter(item => {
      return !viewedIds.includes(item.attributes.id.toString())
    });
    // const dataFiltered = computed(() => )

  });
})

function getLikeList() {
  likeList.value = $getLikedProducts();
}

const liked = computed(() => likeList.value.includes(data.value.id.toString()))
function handleLike(id) {
  $toggleLikeProduct(id)
  getLikeList()
}


function prevHandler() {
  router.replace('/product/' + data.value.extra.previous.slug)
}

function nextHandler() {
  router.replace('/product/' + data.value.extra.next.slug)
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
.info > * {
  display: inline-block;
}



.info .subheader.small {
  margin-bottom: 8px;
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
