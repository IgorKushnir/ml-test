<template>
  <div v-if="data !== null" class="fact p-v-80 p-v-40-md" :class="data.background_color + '_bg'">

    <div class="row justify-center">
      <div :class="['col-6 col-10-md', 'col-8 col-10-md', 'col-8 col-10-md'][layoutIndex]">
        <div v-if="data.logo"  :class="['logo lg', 'logo', 'logo sm'][layoutIndex]">

          <Logo :color="data.text_color"/>

        </div>
        <div class="brake-word" :class="['h1 h3-md', 'h2 h3-md', 'h3'][layoutIndex] + ' ' + data.text_color" v-if="data.title" v-html="$handleNewLine(data.title)"/>
        <div :class="['p p-small-md', 'p p-small-md', 'p-small'][layoutIndex] + ' ' + data.text_color" v-if="data.text" v-html="$handleNewLine(data.text)"/>
      </div>

    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: false
  }
})

const layoutIndex = computed(() => {
  const keys = Object.keys(props.data);
  const index = keys.findIndex(d => d.endsWith('layout'))
  return ['wide', 'normal', 'tight'].findIndex(el => el === props.data[keys[index]])
})


</script>

<style scoped lang="scss">


.fact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  min-height: 100%;
  //background-color: $pink;
  text-align: center;
  //padding: 40px;
  * {
    margin-top: unset;
  }
}

.logo {
  background-image: none;
  height: 88px;
  margin: 0 auto 32px;
}

.logo.lg {
  height: 100px;
}
.logo.sm {
  height: 64px;
}


@include md {
  .logo {
    height: 64px!important;
    margin-bottom: 16px;
  }
}

.light {
  color: #F1F2F3;
}
.dark_blue {
  color: #051C2C;
}
.dark_cerulean {
  color: #004876;
}
.glacier {
  color: #7AA5BA;
}
.vanilla_ice {
  color: #E5D4D3;
}
.gold {
  color: #F6DFA4;
}
.gun_powder {
  color: #4D4E56;
}
.empress {
  color: #726869;
}
.regent_grey {
  color: #7B8687;
}
.alto {
  color: #D2C6C3;
}
.sand {
  color: #D0CAC2;
}


.light_bg {
  background-color: #F1F2F3;
}
.dark_blue_bg {
  background-color: #051C2C;
}
.dark_cerulean_bg {
  background-color: #004876;
}
.glacier_bg {
  background-color: #7AA5BA;
}
.vanilla_ice_bg {
  background-color: #E5D4D3;
}
.gold_bg {
  background-color: #F6DFA4;
}
.gun_powder_bg {
  background-color: #4D4E56;
}
.empress_bg {
  background-color: #726869;
}
.regent_grey_bg {
  background-color: #7B8687;
}
.alto_bg {
  background-color: #D2C6C3;
}
.sand_bg {
  background-color: #D0CAC2;
}
</style>
