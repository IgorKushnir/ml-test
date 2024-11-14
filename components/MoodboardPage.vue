<template>
  <div>

    <InnerHeader :title="isSharedMoodBoardPage ? $t('shared_moodboard_title') : $t('moodboard_title')"/>
    <StickyBarStickyHeaderMilla v-if="data?.liked?.length > 0 && !isSharedMoodBoardPage">
      <template #full>
        <div class="share-button-container">
          <div class="p-small t" v-if="translations.moodboard_description">{{translations.moodboard_description}}</div>
          <p class="p-small t t--wide t--desktop">{{ $t('moodboard_subtitle_desktop') }}</p>
          <p class="p-small t t--mobile">{{ $t('moodboard_subtitle_mobile') }}</p>
          <div class="share p-small" v-on:click="() => shareModalControl.show = true"><span class="icon-taget-16"/>{{ $t('share') }}</div>
        </div>
      </template>
    </StickyBarStickyHeaderMilla>

    <transition name="fade">
      <div v-if="!pending && !firstLoading ">
        <ProductGrid
            :products-data="{data: data?.liked}"
            :pending-products="!data?.liked"
            :grid="4"
            moodboard
            :showLike="!isSharedMoodBoardPage"
        />


        <Carusel v-if="data?.viewed?.length > 0" :data="data?.viewed" class="m-v-80">
          <h2 class="m-t-0 m-b-40 m-b-24-md">{{ $t('moodboard_you_recently_viewed') }}</h2>
        </Carusel>
      </div>
    </transition>

    <Loading :pending="pending || firstLoading"/>

    <SharedLinkModal v-if="shareModalControl.show" :liked="data?.liked" :locale="locale" :control="shareModalControl"/>
    <Seo :title="$t('moodboard_title')" :breadcrumbs="[
        {
          title: $t('moodboard_title'),
        },
    ]"
         :localizations="[{locale: 'en', slug: 'moodboard'}, {locale: 'pl', slug: 'moodboard'}]"
         blockRobots/>
  </div>
</template>

<script setup>
import productsResponse from '~/api/getProductsById'
const {$getViewedProduct, $getLikedProducts, $toggleLikeProduct} = useNuxtApp()
const translations = useTranslationsData().value

const route = useRoute()
const router = useRouter()
const { locale, locales } = useI18n()

const shareModalControl = ref({show: false})
const viewedProductIds = ref([]);
const likedProductIds = ref([]);

const isSharedMoodBoardPage = computed(() => route.params.id != null)
const products = computed(() => {
  const arr = [...viewedProductIds.value, ...likedProductIds.value];
  return arr.filter(function (item, pos) {
    return arr.indexOf(item) === pos;
  })
})

const firstLoading = ref(true)
const data = ref()
const pending = ref(true)

onMounted(() => {
  if (!isSharedMoodBoardPage.value) {
    viewedProductIds.value = $getViewedProduct()
    likedProductIds.value = $getLikedProducts()
    getInitialData()
  } else {
    try {
      const idsString = decodeFromBase64(route.params.id)
      const ids = idsString.split(',')
      likedProductIds.value = ids
      getInitialData()

    } catch (e) {
      console.error(e);
      pending.value = false
      firstLoading.value = false;
    }
  }
})

async function getInitialData() {
  try {
    const productsData = await productsResponse({
      products: products.value,
      lang: locale.value
    })

    const _products = productsData.data.products.data;
    let viewed = _products.filter(product => viewedProductIds.value.includes(product.id))
    let liked = _products.filter(product => likedProductIds.value.includes(product.id))

    viewed.sort((a, b) => viewedProductIds.value.indexOf(a.id) - viewedProductIds.value.indexOf(b.id));
    liked.sort((a, b) => likedProductIds.value.indexOf(a.id) - likedProductIds.value.indexOf(b.id));

    data.value = {viewed, liked}
    pending.value = false
    firstLoading.value = false;
  } catch (e) {
    console.error(e)
  }
}

function decodeFromBase64(string) {
  if (process.client) {
    return atob(string);
  } else {
    return Buffer.from(string, 'base64').toString('utf-8');
  }
}
</script>

<style scoped lang="scss">
.icon-taget-16 {
  margin-left: -8px;
}
.share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  //margin: -1px;
  border: 1px solid $border-dark;
  padding: 0 25px;
  cursor: pointer;

  background-color: $dark-blue;
  color: $white;
  & > * {
    padding: 0 6px;
  }

  //&:hover {
  //  background-color: $light-gray;
  //}

  &.active {
    border-bottom: 2px solid $dark-blue;
    padding-top: 1px;
  }
}
.share-button-container {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;


}
.t {
  text-wrap: balance;
  text-align: right;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 280px;
  line-height: 120%;

  &--wide {
    max-width: max-content;
  }

  &--desktop {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &--mobile {
    display: block;

    @media (min-width: 768px) {
      display: none;
    }
  }
}
@include md {
  .share {
    height: 56px;
    padding: 0 14px;
    & > * {
      padding: 0 6px;
    }
  }
  .t {
    max-width: 250px;
  }
}

</style>
