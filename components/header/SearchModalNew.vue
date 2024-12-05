<template>
  <ClientOnly>
    <teleport to="body">
      <div class="wrapper">
        <transition name="slide">
          <div v-if="show" class="search">
            <div class="container">
              <div class="head row gap-S m-v-0">
                <div class="col-2 p-v-0 hide-lg">
                  <Logo class="logo" color="dark_gray"/>
                </div>
                <div class="col-8 col-10-lg col-12-md p-v-0">
                  <div class="input-container">
                    <input ref="input" v-model="search" alt="Search" :placeholder="$t('search_product_name_or_image')" autocomplete="off" autofocus class="input" :class="errorUrl ? 'error-url' : ''">

                    <div class="icon-search-24"/>
                    <div class="actions p-r-24">
                      <transition name="fade">
                        <Spinner class="loader" v-if="pending"/>
                      </transition>
                      <!--                    <transition name="fade" mode="in-out" >-->
                      <div v-if="search?.length === 0 && !fileAdded" v-on:click="() => inputUpload.click()">
                        <span class="gray">{{ $t('or') }}</span>
                        <strong class="p-small m-l-4"
                                style="cursor: pointer">{{ $t('upload_image') }}</strong>
                        <input ref="inputUpload" accept="image/png, image/jpeg" v-on:change="uploadImage" type='file' hidden/>
                      </div>
                      <!--                    </transition>-->
                      <!--                    <transition name="fade" mode="out-in" >-->
                      <strong v-if="search?.length > 0" v-on:click="search = ''" class="p-small m-l-16"
                              style="cursor: pointer">{{ $t('search_clear') }}</strong>
                      <!--                    </transition>-->
                    </div>
                  </div>
                  <div v-if="errorUrl" class="error"><div class="error-message">{{$t('error_image_upload')}}</div></div>
                </div>


                <div class="col-2 p-v-0 hide-md">
                  <div class="icon-close-24" v-on:click="close"/>
                </div>
              </div>
            </div>


          </div>
        </transition>


        <transition name="fade">
          <div v-if="((result !== null && (result?.hits?.length > 0)) || tags?.length > 0 || collections?.length > 0) && show" class="result">

            <div class="m-t-40 m-t-16-md">
              <!--              Tags-->
              <div class="tags-grid m-v-8" v-if="tags?.length > 0">
                <template v-for="tag in tags">
                  <Tag v-if="tagsNames?.[locale]?.[tag.index]?.slug && tagsNames[locale][tag.index].name"
                       :to="tagsNames[locale][tag.index]?.slug + tag.slug" v-on:click="close">
                    <!--                <Tag v-for="tag in tags" :to="'/dress?'+tag.index+'s='+tag.slug+'&u=t'" v-on:click="close">-->
                    <div>
                      <div class="subheader xs gray m-b-0">{{tagsNames[locale][tag.index].name}}</div>

                      <div v-html="highlight(tag.title, search)"/>
                    </div>
                    <!--                  <span class="icon-arrow-16"/>-->
                  </Tag>
                </template>
              </div>
              <!--              Collections-->
              <div class="tags-grid m-v-8 collections" v-if="collections?.length > 0">
                <Tag v-for="item in collections"
                     :to="localePath('/collection/' + item.slug)"
                     v-on:click="close" class="collection-item">
                  <div style="width: 72px">
                    <div class="ratio-4x3 relative" >
                      <Image :path="{data: {attributes: item.cover_4x3}}" size="small" :alt="item.title"/>
                    </div>
                  </div>

                  <div>
                    <div class="subheader xs gray m-b-0">{{ $t('collection') }}</div>
                    <div class="brake-word m-t-4" v-html="highlight(item.title, search)"/>
                    <!--                    <div class="collection-label gray m-t-4">{{ item.line?.title }}</div>-->
                  </div>
                  <!--                  <div class="collection-label gray m-t-4">{{ item.type?.locale }}</div>-->
                </Tag>
              </div>
            </div>


            <div class="container p-h-16-md">
              <div class="search-grid m-v-40 m-v-16-md">
                <NuxtLink
                    v-for="item in result.hits"
                    :to="localePath('/' + (item?.type?.slug ?? 'product') + '/' + item.slug)"
                    v-on:click="close" class="col-2">


                  <div class="ratio-3x4">
                    <Image :path="{data: {attributes: item.cover_3x4}}" size="small" :alt="item.title"/>
                  </div>
                  <div class="m-t-8 brake-word" v-html="highlight(item.title, search)"/>
                  <div class="collection-label gray m-t-4">{{ item.collection?.title }}</div>
<!--                  <div class="collection-label gray m-t-4">{{ item.type?.locale }}</div>-->
                </NuxtLink>
              </div>
            </div>
          </div>
        </transition>

        <canvas ref="resizedImageCanvas" width="512" style="display: none" class="resized-image" />
      </div>


      <transition name="fade">
        <div v-if="show" v-on:click="close" class="overlay"/>
      </transition>
    </teleport>
  </ClientOnly>

</template>

<script setup>
import {debounce} from "./debounce"
// Todo: 1. Dragndrop; 2. Error toast
const { locale } = useI18n()
const {$isUrl} = useNuxtApp()

const route = useRoute()

const props = defineProps({
  show: {
    type: Boolean,
    required: false
  }
})
const emits = defineEmits(["close"])
let search = ref('')
const inputUpload = ref()
const fileAdded = ref(false)
const input = ref()
const config = useRuntimeConfig();
const result = ref({});
const tags = ref([]);
const collections = ref([]);
const news = ref([]);

const pending = ref(false);
const errorUrl = ref(false);
const resizedImageCanvas = ref();

const tagsNames = {
  en: {
    silhouette: {name: "silhouette", slug: "/dress/silhouettes/"},
    color: {name: "color", slug: "/dress/colors/"},
    style: {name: "style", slug: "/dress/styles/"},
    neckline: {name: "neckline", slug: "/dress/necklines/"},
    decoration: {name: "decoration", slug: "/dress/decorations/"},
    other: {name: "other", slug: "/dress/others/"},
    backneckline: {name: "back necklines", slug: "/dress/backnecklines/"},
    fabric: {name: "fabric", slug: "/dress/fabrics/"},
    "store-finder": {name: "store finder", slug: "/store-finder/"},
    // collection: {name: "collection", slug: "/collection/"}
  },
  pl: {
    silhouette: {name: "silhouette", slug: "/pl/suknie/silhouette/" },
    color: {name: "kolor", slug: "/pl/suknie/kolor/" },
    style: {name: "styl", slug: "/pl/suknie/styl/" },
    neckline: {name: "dekolt", slug: "/pl/suknie/necklinia/" },
    decoration: {name: "dekor", slug: "/pl/suknie/dekor/" },
    other: {name: "inni", slug: "/pl/suknie/inni/" },
    backneckline: {name: "dekolt z tylu", slug: "/pl/suknie/dekolt-z-tylu/" },
    fabric: {name: "tkanina", slug: "/pl/suknie/tkanina/" },
    "store-finder": {name: "wyszukiwarka sklepow", slug: "/wyszukiwarka-sklepow/"},
    // collection: {name: "kolekcje", slug: "/pl/kolekcja/"} //todo: link to collection
  },
}


async function settings() {
  const data = await $fetch(`indexes/product/settings`, {
    baseURL: 'http://127.0.0.1:7700',
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer '
    },
    body: {
      "displayedAttributes": [
        "title",
        "id",
        "slug",
        "cover_3x4",
        "type",
        "collection",
      ],
       "filterableAttributes": ["locale"],
      "searchableAttributes": [
        "title",
      ]
    }
  });
  // console.log(data);




  // const data = await $fetch(`keys`, {
  //   baseURL: config.SEARCH_URL,
  //   method: 'GET',
  //   headers: {
  //     Authorization:
  //         'Bearer ' + config.MEILISEARCH_API_KEY,
  //   }
  // });
  // console.log(data);
}

// Product settings
// {
//   "displayedAttributes": [
//   "title",
//   "id",
//   "slug",
//   "cover_3x4.formats.small",
//   "type.title",
//   "type.slug",
//   "collection.title",
//   "collection.slug"
// ],
//     "filterableAttributes": ["locale"],
//     "searchableAttributes": [
//   "title"
// ]
// }

// Collection settings
// {
//   "displayedAttributes": [
//   "title",
//   "id",
//   "slug",
//   "cover_4x3.formats.small",
//   "line.title",
//   "line.slug",
//   "locale"
// ],
//     "filterableAttributes": ["locale"],
//     "searchableAttributes": [
//   "title"
// ]
// }

// Tags settings
// PATCH http://localhost:7700/indexes/--NAME_OF_ONDEX--/settings
// {
//   "displayedAttributes": [
//   "title",
//   "id",
//    "slug",
//   "locale"
// ],
//     "filterableAttributes": ["locale"],
//     "searchableAttributes": [
//   "title"
// ]
// }

async function getResult() {
  pending.value = true;
  errorUrl.value = false
  if (search.value?.length === 0) {
    result.value = [];
    tags.value = [];
    collections.value = [];
    news.value = [];
  } else {
    const res = await $fetch(`/api/search?q=${search.value}&locale=${locale.value}`, {
      method: 'GET'
    });

    const {color, fabric, line, decoration, backneckline, neckline, silhouette, style, other} = res;

    const _tags = [];

    [color, fabric, line, decoration, backneckline, neckline, silhouette, style, other]?.forEach(resultItem => {
      if (resultItem?.hits?.length) {
        _tags.push(...resultItem.hits.map(hit => {
          return {
            ...hit,
            index: resultItem.index
          }
        }))
      }
    })
      if (res["store-finder"]?.hits?.length) {
        _tags.push(...res["store-finder"].hits
        .map(({country, id, slug, city}) => 
          ([
            { 
              title: country,
              id,
              slug,
              index: res["store-finder"].index
            }, 
            ...city.map((city, idx) => 
              ({
                ...city,
                title: city.name,
                slug: city?.storesExist ? `${slug}?city=${idx}` : slug,
                index: res["store-finder"].index
              })
            )
          ])
        )
        .flat()
        .filter(({state, title}) => 
          title.toLowerCase().includes(search.value.toLowerCase()) 
          || state?.toLowerCase()?.includes(search.value)
        )
        )
      }

    tags.value = _tags
    collections.value = res?.collections?.hits;
    result.value = res.products;
  }
  pending.value = false;
}
const debouncedGetResult = debounce(getResult)
watch(search, () => {
  // settings()
  if ($isUrl(search.value)) {
    // console.log('url'); // title, id, type, slug, cover_3x4
    searchByImage(search.value)
  } else {
    // console.log('not url');
    debouncedGetResult()
  }
})
watch(() => input.value, () => {
  if (input.value) {
    input.value.focus();
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
})

function close() {
  search.value = ''
  emits('close')
}

function highlight(text, search) {
  var innerHTML = text;
  var index = innerHTML?.toLowerCase().indexOf(search?.toLowerCase());

  if (index >= 0) {
    innerHTML = innerHTML.substring(0, index) + "<strong>" + innerHTML.substring(index, index + search?.length) + "</strong>" + innerHTML.substring(index + search?.length);
    return innerHTML;
  }
  return text;

}

async function searchByImage(url) {
  result.value = []
  pending.value = true
  errorUrl.value = false


  try {
    // Resize
    url = await resizeUploadedImage(url)
    if (!url) throw 'error'

    // console.log({url});
    // Search
    const res = $fetch('/api/image-search', {
      method: "POST",
      body: {
        // text: query.value
        url: url,
        locale: locale.value
      }
    })
    // https://millanova.nyc3.cdn.digitaloceanspaces.com/medium_N9_A5224_24d501e9fb.jpg1
    let images = await res
    if (images) {
      images = images.map(im => {
        const r = {score: im.score, ...im.metadata}
        try {
          r.cover_3x4 = JSON.parse(r.cover_3x4)
          r.type = JSON.parse(r.type)
          if (r.collection) r.collection = JSON.parse(r.collection)
        } catch (e) {}
        return r
      })
      result.value = {hits: images}
    } else {
      console.error('error image url');
      errorUrl.value = true
      pending.value = false
    }

  } catch (e) {
    console.error(e);
    errorUrl.value = true
    pending.value = false
  }
  pending.value = false
  fileAdded.value = false;

  // search.value = ''
}

async function uploadImage(file) {
  fileAdded.value = true;
  const base64 = await convertFileToBase64(file.target.files[0]);
  await searchByImage(base64)


}
async function resizeUploadedImage(imgUrl) {
  var canvas = resizedImageCanvas.value;
  var ctx = canvas.getContext("2d");
  var img = new Image();

  // const base = await convertUrlToBase64(imgUrl)
  // console.log({base});

  // console.log({imgUrl});

  let fetchedMeta = false;
  return new Promise((resolve, reject) => {
    img.onload = function () {

      // set size proportional to image
      canvas.height = canvas.width * (img.height / img.width);

      // step 1 - resize to 50%
      var oc = document.createElement('canvas'),
          octx = oc.getContext('2d');

      oc.width = img.width * 0.5;
      oc.height = img.height * 0.5;
      octx.drawImage(img, 0, 0, oc.width, oc.height);

      // step 2
      octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

      // step 3, resize to final size
      ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
          0, 0, canvas.width, canvas.height);

      // console.log(canvas, 'loaded');
      resolve(canvas.toDataURL("image/jpeg"))
    }
    img.onerror = async function(e) {
      if (imgUrl?.indexOf('pinterest.com') && !fetchedMeta) {
        const image = await getImageUrlFromPageMeta(imgUrl)
        imgUrl = image
        img.src = image;
        fetchedMeta = true;
      } else {
        // console.error('The Url is a not valid image', e);
        console.error('Can not resize the image');
        resolve(imgUrl)
        // reject()
      }
    };

    img.crossOrigin="anonymous"
    img.src = imgUrl

  })

}

async function getImageUrlFromPageMeta(url) {
  const endpoint = 'https://squid-app-qko7x.ondigitalocean.app/metascraper/?url='
  try {
    const data = await $fetch(endpoint + url)
    // console.log({data});
    // console.log(data.image);
    return data.image

  } catch (e) {
    console.error(e);
    throw e
  }
}



const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};


</script>

<style scoped lang="scss">
.resized-image {
  position: absolute;
  width: 200px;
  top: 0;
  z-index: 99;
}

.search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 99;
  background-color: $white;
}

.head {
  display: flex;
  height: 152px;
  align-items: center;
}

.overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: $overlay;
  z-index: 98;
}
.search-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 40px;
  * {
    width: 100%;
  }
}

.logo {
  width: 80px;
  height: 80px;
}

.icon-close-24 {
  font-size: 24px;
  cursor: pointer;
  margin-left: auto;
  width: 24px;
}

.icon-search-24 {
  font-size: 24px;
  position: absolute;
  left: 16px;
  top: 16px;
}

.input-container {
  position: relative;
}

.input {
  width: 100%;
  height: 56px;
  background-color: $light-gray;
  border: none;
  font-size: 20px;
  padding-left: 56px;

  padding-right: 120px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
//.input.error-url {
//  text-decoration: wavy;
//  text-decoration-color: red;
//  text-decoration-line: underline;
//}
.input.error-url {
  box-shadow: 0px 0px 0px 1px $red inset;
}
.error {
  position: absolute;
}
//.error-message {
//  width: 100%;
//  background-color: $dark-blue;
//  display: block!important;
//  width: 100%!important;
//}

.input:focus {
  outline: none;
}
::placeholder {
  color: $dark-blue;
  opacity: .3;
}
.collection-label {
  font-size: 12px;
}

.actions {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
//.actions > * {
//  position: absolute;
//  right: inherit;
//}
//.loader {
//  position: relative!important;
//}


.result {
  position: fixed;
  background: $white;
  border-top: 1px solid $border-dark;
  top: 152px;
  width: 100%;
  height: calc(100vh - 152px);
  z-index: 99;
  overflow-y: auto;
}
.collections {
  display: flex;
  //flex-wrap: wrap;
}
.collection-item {
  //display: inline-flex;
  //width: auto;
}

@include lg {
  .search-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@include md {
  .search {
    background-color: $dark-blue;
    top: 56px;
    .container {
      padding: 0 16px;
    }
  }
  .head {
    height: 56px;
  }
  .overlay {
    top: 56px
  }
  .input {
    height: 40px;
    font-size: 16px;
    padding-left: 40px;
    padding-right: 72px;
  }

  .icon-search-24 {
    top: 8px;
    left: 8px;
  }
  .actions {
    right: -8px;
  }
  .result {
    top: 112px;
    border-top: none;
    height: calc(100vh - 112px);
  }
  .search-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }
  .error-message {
    background-color: $dark-blue;
  }
}




.tags-grid {
  display: flex;
  //flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
  overflow: auto;
  padding: 0 max(calc((100% - $grid-max-width) / 2 + 40px), 40px);
}
@include md {
  .tags-grid {
    padding: 0 16px;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(0, -152px);
}
</style>
