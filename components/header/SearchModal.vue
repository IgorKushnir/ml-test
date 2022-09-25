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
                <div class="col-8 col-10-lg col-12-md p-v-0 input-container">
                  <input ref="input" v-model="search" alt="Search" placeholder="Product name" autocomplete="off" autofocus class="input">
                  <div class="icon-search-24"/>
                  <div class="actions p-r-24">
                    <transition name="fade">
                      <Spinner v-if="pending"/>
                    </transition>
                    <transition name="fade">
                      <strong v-if="search.length > 0" v-on:click="search = ''" class="p-small m-l-16"
                              style="cursor: pointer">Clear</strong>
                    </transition>
                  </div>
                </div>
                <div class="col-2 p-v-0 hide-md">
                  <div class="icon-close-24" v-on:click="close"/>
                </div>
              </div>
            </div>


          </div>
        </transition>

        <transition name="fade">
          <div v-if="result !== null && show && (result.nbHits > 0 || result.estimatedTotalHits > 0)" class="result">
            <div class="container">
<!--              <div v-if="result.nbHits === 0">No results</div>-->
              <div class="search-grid m-v-40">
                <NuxtLink
                    v-for="item in result.hits" :to="'/' + (item?.type?.slug ?? 'product') + '/' + item.slug"
                    v-on:click="close" class="col-2">
                  <div class="ratio-3x4">
                    <Image :path="{data: {attributes: item.cover_3x4}}" size="small" :alt="item.title"/>
                  </div>
                  <div class="m-t-8 brake-word" v-html="highlight(item.title, search)"/>
                  <div class="collection-label gray m-t-4">{{ item.collection?.title }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </transition>

      </div>


      <transition name="fade">
        <div v-if="show" v-on:click="close" class="overlay"/>
      </transition>
    </teleport>
  </ClientOnly>

</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: false
  }
})
const emits = defineEmits(["close"])
let search = ref('')
const input = ref()
const config = useRuntimeConfig();
const result = ref([]);
const pending = ref(false);

async function settings() {
  // const data = await $fetch(`indexes/product/settings`, {
  //   baseURL: config.SEARCH_URL,
  //   method: 'POST',
  //   body: {
  //     "displayedAttributes": [
  //       "title",
  //       "id",
  //       "slug",
  //       "cover_3x4",
  //       "type",
  //       "collection",
  //     ],
  //     "searchableAttributes": [
  //       "title",
  //     ]
  //   }
  // });
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
  if (search.value.length === 0) {
    result.value = [];
  } else {
    const data = await $fetch(`indexes/product/search`, {
      baseURL: config.SEARCH_URL,
      method: 'POST',
      headers: {
        Authorization:
            'Bearer ' + config.MEILISEARCH_API_KEY,
      },
      // baseURL: "https://millanovasearch.sarakuz.com",
      // method: 'POST',
      // headers: {
      //   Authorization:
      //       'Bearer ' + "YTQ5MmM1M2FlOTJlYWZiN2Q4NWRmZmE0",
      // },
      body: {
        "q": search.value,
      }
    });
    result.value = data;
  }
  pending.value = false;
}

watch(search, () => {
  settings();
  getResult()
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

</script>

<style scoped lang="scss">


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
  left: 36px;
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
}

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
  right: 20px;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}


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
    padding-left: 56px;
  }

  .icon-search-24 {
    top: 8px;
    left: 32px;
  }
  .actions {
    right: 8px;
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
