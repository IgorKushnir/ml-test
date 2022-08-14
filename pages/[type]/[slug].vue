<template>
  <div>
    <Seo :data="data"/>

    <div v-if="data != null">

      <StickyHeader :title="data.title">
        <template #end>
          <StickyBarBack v-if="data.extra.previous" reverse text="Previous" @clicks="prevHandler"/>
          <StickyBarBack v-if="data.extra.next" text="Next" @click="nextHandler"/>
        </template>
      </StickyHeader>



      <div class="promo ratio-3x4 show-md">
        <Image :path="{data: data.gallery.data[0]}" :alt="data.title"/>
        <div class="white-overlay"></div>
      </div>
      <Container>

        <div class="col-4 col-5-lg col-12-md">
          <div class="">
            <h1 class="title m-t-0">{{ data.title }}</h1>
          </div>
          <div class="sticky-content">
            <p class="m-b-32" v-if="data.description" v-html="$handleNewLine(data.description)" />


            <div class="info m-t-40" v-if="data.collection.data">
              <div class="m-b-32 m-r-40">
                <div class="subheader small">Collection</div>
                <div class="p-small"><strong>{{ data.collection.data.attributes.title }}</strong></div>
              </div>
              <div class="m-b-32">
                <div class="subheader small">Line</div>
                <div class="p-small">
                  <strong>{{ data.collection.data.attributes.line.data.attributes.title }}</strong>
                </div>
              </div>
            </div>

            <div v-if="data.colors.data.length > 0" class="info m-b-32">
              <div>
                <div class="subheader small">Color</div>
                <div class="p-small"><strong>
                  {{ data.colors.data.map(color => color.attributes.title).join(', ') }}
                </strong></div>
              </div>
            </div>

            <div v-if="data.properties.length > 0" class="info m-b-32">
              <div v-for="property in data.properties" class="m-b-32">
                <div class="subheader small">{{ property.title }}</div>
                <div v-if="property.description" class="p-small"><strong>
                  {{ property.description }}
                </strong></div>
              </div>
            </div>
          </div>
        </div>


        <ContentMediaGrid :data="data.gallery.data" :hide-first="isMobile" classes="col-8 col-7-lg col-12-md m-t-0" columns="product">
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
const { $setViewedProduct, $getViewedProduct } = useNuxtApp()
const isMobile = useIsMobile();

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;
let draft = route.query?.draft;

let publicationState = "LIVE";
if (draft === 'true') {
  publicationState = "PREVIEW";
}

const extrudedIds = useViewedProductIds().value;

let {data, pending, refresh, error} = await getProduct(slug, JSON.stringify(extrudedIds), publicationState)



onMounted(() => {
  refresh().then(_ => {
    $setViewedProduct(data.value.id, data.value.slug)

    const viewedIds = $getViewedProduct().map(p => p.id ?? 0)
    useViewedProductIds().value = viewedIds;

    data.value.extra.also = data.value.extra.also.filter(item => {
      return !viewedIds.includes(item.attributes.id.toString())
    });
    // const dataFiltered = computed(() => )

  });
})





function prevHandler() {
  router.replace('/product/' + data.value.extra.previous.slug)
}

function nextHandler() {
  router.replace('/product/' + data.value.extra.next.slug)
}




</script>

<style scoped lang="scss">
@import  "/assets/style/global.scss";

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

}


</style>
