<template>
  <svg width="100%" height="100%" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M101.218 187.824H94.0492L89.3292 183.996V72.6458L94.033 68.9314H101.218L127.976 121.345L154.734 68.9314H161.917L166.637 72.7593V184.11L161.933 187.824H154.748V187.819L124.419 128.378H124.381L101.218 82.9818V187.824ZM131.573 128.375L154.748 82.9546V173.768L131.587 128.375H131.573Z" :fill="hexColor"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13 128.377C13 69.0762 64.4824 21 128 21C191.518 21 243 69.0762 243 128.377C243 187.677 191.518 235.753 128 235.753C64.4824 235.753 13 187.677 13 128.377ZM23.2186 128.377C23.2186 186.25 70.1269 233.158 128 233.158C185.873 233.158 232.781 186.25 232.781 128.377C232.781 70.5035 185.873 23.5952 128 23.5952C70.1269 23.5952 23.2186 70.5035 23.2186 128.377Z" :fill="hexColor"/>
  </svg>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    required: false,
    default: 'dark_blue'
  }
})
const colors = {
  dark_blue: "#051C2C",
  dark_cerulean: "#004876",
  glacier: "#7AA5BA",
  vanilla_ice: "#E5D4D3",
  gold: "#F6DFA4",
  gun_powder: "#4D4E56",
  empress: "#726869",
  regent_grey: "#7B8687",
  alto: "#D2C6C3",
  sand: "#D0CAC2",
  light: "#F1F2F3",
  dark_gray: "#DBDEE0",

}
const hexColor = computed(() => colors[props.color])
</script>

<style scoped>

</style>
