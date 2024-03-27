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
                      <div v-if="search.length === 0 && !fileAdded" v-on:click="() => inputUpload.click()">
                        <span class="gray">{{ $t('or') }}</span>
                        <strong class="p-small m-l-4"
                                style="cursor: pointer">{{ $t('upload_image') }}</strong>
                        <input ref="inputUpload" accept="image/png, image/jpeg" v-on:change="uploadImage" type='file' hidden/>
                      </div>
                      <!--                    </transition>-->
                      <!--                    <transition name="fade" mode="out-in" >-->
                      <strong v-if="search.length > 0" v-on:click="search = ''" class="p-small m-l-16"
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
          <div v-if="result !== null && show && (result?.hits?.length > 0)" class="result">

            <div class="container">
<!--              <pre>{{result}}</pre>-->

              <!--              <div v-if="result.nbHits === 0">No results</div>-->
              <div class="search-grid m-v-40">
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
// Todo: 1. Dragndrop; 2. Error toast
const { locale } = useI18n()
const {$isUrl} = useNuxtApp()

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
const pending = ref(false);
const errorUrl = ref(false);
const resizedImageCanvas = ref();

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

async function getResult() {
  pending.value = true;
  errorUrl.value = false
  if (search.value.length === 0) {
    result.value = [];
  } else {
    // const data = await $fetch(`indexes/product/search`, {
    //   baseURL: config.SEARCH_URL,
    //   method: 'POST',
    //   headers: {
    //     Authorization:
    //         'Bearer ' + config.MEILISEARCH_API_KEY,
    //   },
    //   body: {
    //     "q": search.value,
    //   }
    // });

    const data = await $fetch(`/api/search?q=${search.value}&locale=${locale.value}`, {
      method: 'GET'
    });

    // // Filter by locale
    // // todo: needs to fix fol poland
    // data.hits = data.hits.filter(d => d.type?.locale === locale.value)
    // if (data.hits.length === 0) {
    //   data.estimatedTotalHits = 0
    //   data.nbHits = 0
    // }


    result.value = data;
  }
  pending.value = false;
}

watch(search, () => {
  // settings()
  if ($isUrl(search.value)) {
    // console.log('url'); // title, id, type, slug, cover_3x4
    searchByImage(search.value)
  } else {
    // console.log('not url');
    getResult()
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
  emits('close')
}

function highlight(text, search) {
  var innerHTML = text;
  var index = innerHTML.toLowerCase().indexOf(search.toLowerCase());

  if (index >= 0) {
    innerHTML = innerHTML.substring(0, index) + "<strong>" + innerHTML.substring(index, index + search.length) + "</strong>" + innerHTML.substring(index + search.length);
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

// function convertUrlToBase64(url, callback) {
//   return new Promise((resolve, reject) => {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//       var reader = new FileReader();
//       reader.onloadend = function() {
//         resolve(reader.result);
//       }
//       reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
//   })
//
// }

// const convertUrlToBase64 = url => fetch(url)
//     .then(response => response.blob())
//     .then(blob => new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => resolve(reader.result)
//       reader.onerror = reject
//       reader.readAsDataURL(blob)
//     }))
//     .catch(e => console.error(e))



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



.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(0, -152px);
}
</style>
