<template>
  <div>
    <div class="overlay" v-on:click="() => props.control.show = false"/>
    <div class="modal-container">
      <div class="modal center">
<!--        <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--          <path d="M21.7819 3.11367L21.7832 3.11249C23.786 1.31916 26.2048 0.5 28.6082 0.5C33.3502 0.5 37.9911 3.71337 39.1373 9.00583L39.1372 9.00584L39.1392 9.01435C39.9688 12.5457 39.3508 16.3303 37.4606 19.3977C36.187 21.4591 34.0027 23.8071 31.5688 26.0795C29.1421 28.3452 26.4958 30.5098 24.3227 32.2048C23.7185 32.6704 22.5699 33.5159 21.5671 34.2488C21.0665 34.6147 20.6038 34.9513 20.2664 35.1964L20.01 35.3824C19.936 35.3288 19.8498 35.2662 19.7534 35.1961C19.4156 34.9507 18.9524 34.6135 18.4506 34.2464C17.4446 33.5106 16.2906 32.6597 15.6771 32.1847C13.5048 30.5003 10.8583 28.3356 8.4314 26.0672C5.99758 23.7924 3.81302 21.4392 2.53926 19.3775C0.64914 16.3101 0.0312429 12.5256 0.860825 8.99435L0.860868 8.99436L0.862299 8.98788C2.0277 3.71383 6.66964 0.5 11.4118 0.5C13.8152 0.5 16.234 1.31916 18.2368 3.11249L18.2434 3.1184L18.2502 3.12408C18.4853 3.32006 18.693 3.53502 18.9223 3.77228C19.0182 3.87151 19.1179 3.97464 19.2249 4.08192C19.3721 4.24917 19.518 4.39511 19.6521 4.52922L19.6564 4.53352L20.01 4.88718L20.3636 4.53352L20.7835 4.11352L20.7886 4.10846L20.7935 4.10326L20.8123 4.08328C21.1476 3.72815 21.4477 3.41085 21.7819 3.11367Z" stroke="#051C2C"/>-->
<!--        </svg>-->

        <div class="close hide-md" v-on:click="() => props.control.show = false">
          <div class="icon-close-24"/>
        </div>
        <div v-if="liked && liked?.length > 0" class="images">
          <div v-for="img in liked" class="img" :class="liked.length > 9 ? 'small' : ''">
            <Image :path="img.attributes.cover_3x4" size="thumbnail" />
          </div>
        </div>


        <div class="h3 m-b-4">{{$t('share_this_board')}}</div>



        <div class="p-small m-b-16 gray">{{liked?.length}} dress</div>
<!--        <div class="m-b-32">-->
<!--          <NuxtLink :to="link" class="link">{{link}}</NuxtLink>-->
<!--        </div>-->
        <div class="button" :class="copied ? '' : 'primary'" v-on:click="copy">{{ copied ? $t('copied') : $t('copy_link') }}</div>
        <div class="button show-md m-t-8" v-on:click="props.control.show = false">{{ $t('close') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  liked: {
    type: Object
  },
  control: {
    type: Object
  },
  locale: {
    type: String
  }
})
const copied = ref(false)

const imgIds = computed(() => props.liked.map(l => l.id))
const linkBase = computed(() => encodeToBase64(imgIds.value.join(',')))
const link = computed(() => 'https://millanova.com' + (props.locale !== 'en' ? ('/' + props.locale) : '') + '/moodboard/' + linkBase.value)

function copy() {
  // const encode = encodeToBase64(imgIds.value.join(','))
  // console.log({encode});
  // const decode = decodeFromBase64(encode)
  // console.log({decode});


  navigator.clipboard.writeText(link.value).then(function() {
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });

}
function encodeToBase64(string) {
  if (process.client) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const base64 = btoa(String.fromCharCode.apply(null, data));
    return base64;

  } else {
    return Buffer.from(string, 'utf-8').toString('base64');
  }
}



onMounted(() => {

})

</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  background-color: $dark-blue;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 99;
  opacity: .4;
}
.modal-container {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.modal {
  position: relative;
  background-color: white;
  padding: 48px;
  min-width: 600px;
  max-width: 600px;
  pointer-events: auto;
}
.close {
  position: absolute;
  padding: 12px;
  width: 48px;
  height: 48px;
  top: 16px;
  right: 16px;
  cursor: pointer;
}
.icon-close-24 {
  width: 24px;
  height: 24px;
  font-size: 24px;
  //transition: .3s ease-in-out;
}
//.close:hover .icon-close-24 {
//  //transform: rotate(90deg);
//}
.link {
  display: inline;
}
//.icon-heart-no-24 {
//  font-size: 48px;
//}
.link {
  //font-size: 14px;
}
.images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.img {
  width: 40px;
  height: 64px;
  overflow: hidden;
  position: relative;
}
.img.small {
  width: 24px;
  height: 40px;
}


@include md {
  .modal-container {
    //align-items: flex-start;
    //margin-top: 5vh;
  }
  .modal {
    min-width: 90%;
    max-width: 90%;
    padding: 32px;

    //min-height: 90vh;
  }
  .images {
    height: 64px;
    overflow: hidden;
  }
  .button {
    display: block;
  }
}
</style>
