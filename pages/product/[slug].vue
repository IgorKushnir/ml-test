<template>
  <div>
    <div v-if="data != null">
      <!--      <InnerHeader :title="data.title" :sub_title="data.description"/>-->

      <StickyHeader :title="data.title">
        <template #end>
          <StickyBarBack v-if="data.extra.previous" reverse text="Previous" @clicks="prevHandler"/>
          <StickyBarBack v-if="data.extra.next" text="Next" @click="nextHandler"/>
        </template>
      </StickyHeader>




      <Container>
        <div class="col-4 col-5-lg col-12-md">
          <div class="">
            <h1 class="title m-t-0">{{ data.title }}</h1>
          </div>
          <div class="sticky-content">
            <p class="m-b-32">{{ data.description }}</p>


            <div class="info m-b-32" v-if="data.collection.data">
              <div>
                <div class="subheader small">Collection</div>
                <div class="p-small"><strong>{{ data.collection.data.attributes.title }}</strong></div>
              </div>
              <div>
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
          </div>
        </div>


        <div class="gallery col-8 col-7-lg col-12-md m-t-0">



          <template v-for="(img, index) in data.gallery.data">
            <div
                :class="isLandscape(img.attributes.width, img.attributes.height) ? 'vertical' : 'horizontal'"
            >
              <div :class="isLandscape(img.attributes.width, img.attributes.height) ? 'ratio-3x4' : 'ratio-3x2'">
                <Image
                    :path="{data: img}"
                    :alt="data.title"
                />
              </div>
            </div>
          </template>

          <div v-if="data.fact !== null" class="vertical">
            <div class="ratio-3x4">
              <Fact :data="data.fact"/>
            </div>
          </div>
        </div>


      </Container>

      <Carusel v-if="data.recommended !== null" :data="data.recommended?.products.data" title="Recommendation" class="m-v-80"/>
      <Carusel v-if="data.extra !== null" :data="data.extra?.also" title="You may also like" :column="4" class="m-v-80"/>


    </div>
    <Loading :pending="pending"/>
    <PageNotFound :show="data == null"/>
  </div>
</template>

<script setup lang="ts">
import getProduct from '~/api/getProduct'
const { $setViewedProduct } = useNuxtApp()

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;


let {data, pending, refresh, error} = await getProduct(slug)
onMounted(() => {
  refresh().then(_ => {
    $setViewedProduct(data.value.id, data.value.slug)
  });
})



function prevHandler() {
  router.replace('/product/' + data.value.extra.previous.slug)
}

function nextHandler() {
  router.replace('/product/' + data.value.extra.next.slug)
}

function isLandscape(width, height) {
  return (width / height) < 1
}



</script>

<style scoped lang="scss">
.info > * {
  display: inline-block;
}

.info > *:nth-child(2) {
  margin-left: 40px;
}

.info .subheader.small {
  margin-bottom: 8px;
}

.sticky-content {
  position: sticky;
  top: 104px;
}


.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  grid-auto-flow: dense;
}
.horizontal {
  grid-column: auto/span 2;
}
.vertical {
  grid-column: auto/span 1;
}

@include md {
  .sticky-content {
    position: relative;
    top:0
  }
}
@include xl {
  .gallery {
    grid-gap: 16px;
  }
}
@include sm {
  .gallery {
    grid-template-columns: 1fr;
  }
  .horizontal {
    grid-column: auto/span 1;
  }
  .vertical {
    grid-column: auto/span 1;
  }
}

</style>
