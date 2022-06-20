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

          <div class="m-b-32">
            <h1 class="title m-t-0">{{ data.title }}</h1>
            <p>{{ data.description }}</p>
          </div>

          <div class="info m-b-32">
            <div>
              <div class="subheader small">Collection</div>
              <div class="p-small"><strong>{{ data.collection.data.attributes.title }}</strong></div>
            </div>
            <div>
              <div class="subheader small">Line</div>
              <div class="p-small"><strong>{{ data.collection.data.attributes.line.data.attributes.title }}</strong>
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


        <Container class="gallery col-8 col-7-lg col-12-md m-t-0">
          <div v-if="data.fact !== null" class="col-6 ">
            <div class="ratio-3x4">
              <Fact :data="data.fact"/>
            </div>
          </div>
          <template v-for="(img, index) in data.gallery.data">
            <div
                :class="isLandscape(img.attributes.width, img.attributes.height) ? 'col-6 col-12-lg col-6-md col-12-sm' : 'col-12'"
                :style="'order: '+index"
            >
              <div :class="isLandscape(img.attributes.width, img.attributes.height) ? 'ratio-3x4' : 'ratio-4x3'">
                <Image
                    :path="{data: img}"
                    :alt="data.title"
                />
              </div>
            </div>
          </template>
        </Container>


      </Container>

      <Carusel :data="data.recommended?.products.data" title="Recommendation" class="m-v-80"/>

      <!--      <pre v-if="data.recommended !== null">{{ data.recommended.products.data.length }}</pre>-->


    </div>
    <Loading :pending="pending"/>
    <PageNotFound :show="data == null"/>
  </div>
</template>

<script setup lang="ts">
import getProduct from '~/api/getProduct'

const route = useRoute();
const router = useRouter();
let slug = route.params.slug;


let {data, pending, refresh, error} = await getProduct(slug)
onMounted(() => {
  refresh()
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


.gallery {
  margin-top: 0 !important;
}

</style>
