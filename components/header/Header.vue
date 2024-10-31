<template>
  <HeaderSearchModalNew  :show="showSearch" @close="showSearch = false"/>

<!--  <transition name="fade">-->
<!--    <HeaderWishCounter v-if="$route.name !== 'moodboard'"  class="show-md"/>-->
<!--  </transition>-->
  <header class="navigation">

    <div class="container" style="position: static;">
      <div class="top-nav">
        <div class="left-side" v-if="data[0]?.length > 0">
          <NuxtLink v-for="item in data[0]['primary_additional']" :to="$isAbsoluteUrl(item.url) ? item.url : localePath(item.url)" :class="'nav-link__tertiary hover hide-md' + (item.target ? ' target' : '')" :target="item.target ? '_target' : '_self'">{{item.title}}</NuxtLink>

<!--          <ClientOnly>-->
<!--&lt;!&ndash;            <pre>{{$route.meta.locales}}</pre>&ndash;&gt;-->
<!--            <a v-if="show_pl === 'true'" :href="$route.meta.locales?.en?.path ?? '/'" class="nav-link__tertiary hover hide-md" :class="locale === 'en' ? 'router-link-active' : ''">English</a>-->
<!--            <a v-if="show_pl === 'true'" :href="$route.meta.locales?.pl?.path ?? '/pl'" class="nav-link__tertiary hover hide-md" :class="locale === 'pl' ? 'router-link-active' : ''">Polska</a>-->
<!--&lt;!&ndash;            <NuxtLink  v-if="true || locale !== 'en'" :to="switchLocalePath('en') === '' ? '/' : switchLocalePath('en')" class="nav-link__tertiary hover hide-md">English</NuxtLink>&ndash;&gt;-->
<!--&lt;!&ndash;            <NuxtLink v-if="true || locale !== 'pl'" :to="switchLocalePath('pl') === '' ? '/' : switchLocalePath('pl')" class="nav-link__tertiary hover hide-md">Poland</NuxtLink>&ndash;&gt;-->
<!--          </ClientOnly>-->

          <HeaderWishCounter class="show-md" />

          <div v-on:click="showHideMenu" class="nav-icon hover mobile-menu">
            <div v-if="!mobileMenuOpened" class="icon-menu-24"/>
            <div v-else class="icon-close-24"/>
          </div>
        </div>

        <!-- Logo-->
        <NuxtLink v-if="$route.path !== localePath('/')" :to="localePath('/')" class="logo-container">
          <img src="@/assets/img/logo.svg" alt="Milla Nova Logo" class="logo" />
        </NuxtLink>
        <div v-else class="logo-container">
          <img src="@/assets/img/logo.svg" alt="Milla Nova Logo" class="logo" />
        </div>

        <div class="right-side">
          <HeaderWishCounter class="hide-md"/>
          <div class="nav-icon hover" v-on:click="showHideSearch">
            <div :class="showSearch ? 'icon-close-24' : 'icon-search-24'"/>
          </div>
        </div>
      </div>

      <div ref="menu_wrapper" class="menu_wrapper hide">
        <div class="nav" v-if="data[0]">
          <ul v-for="(item, index) in data[0]['primary']" class="nav-container">
            <li>
              <NuxtLink
                  ref="link"
                  :to="!(hasSubMenu(item) && isMobile) ? localePath(item.url) : null"
                  :target="item.target ? '_blank' : '_self'"
                  :class="(item.target ? 'nav-link hover target' : 'nav-link hover') + (hasSubMenu(item) ? ' dropdown' : '')"
                  v-on:click="navClickHandler(hasSubMenu(item), index)"
                  @mouseenter="mouseEnterHandler(hasSubMenu(item), index)"
              >
                {{ item.title }}
              </NuxtLink>


              <Transition name="show-line">
                <div class="active-line" v-if="(item.show ?? false) && (hasSubMenu(item))"></div>
              </Transition>
              <div class="nav-dropdown-container" v-if="hasSubMenu(item)" ref="dropdown">
                <Transition name="slide-fade" @enter="enterAnimation" @leave="leaveAnimation">
                  <HeaderDropdown v-show="item.show ?? false" :item="item" :lines="data[1]" :show="item.show ?? false"/>
                </Transition>
              </div>

            </li>
          </ul>

          <div class="m-v-32 show-md" v-if="data[0]?.length > 0">
            <NuxtLink
                v-for="item in data[0]['primary_additional']" :to="item.url"
                style="display: block"
                :class="'nav-link__tertiary hover p-v-8 m-v-4' + (item.target ? ' target' : '')"
                :target="item.target ? '_target' : '_self'">{{item.title}}
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>


  </header>
</template>

<script setup lang="js">
import { enter, leave} from '~/api/misc/transitions';

const { locale } = useI18n()

const data = useMenuData();

const isMobile = useIsMobile();
let activeIndex = ref(0);
const dropdown = ref();
const link = ref();
const menu_wrapper = ref();
let mobileMenuOpened = ref(false)

const showSearch = ref(false)




// // Temporary for showing PL ------------------
//
// const show_pl = ref(false)
// onMounted(() => {
//   const route = useRoute()
//   if (route.query['show_pl']) {
//     document.cookie = "show_pl="+route.query['show_pl'];
//     navigateTo('/')
//   }
//
//   show_pl.value = getCookie('show_pl');
//   // console.log(show_pl.value);
//
//   function getCookie(name) {
//     let matches = document.cookie.match(new RegExp(
//         "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//     ));
//     return matches ? decodeURIComponent(matches[1]) : undefined;
//   }
// })
// /// --------------------






// On mobile click to submenu open
function navClickHandler(isDropdown, index) {
  if (isMobile.value && isDropdown) {
    if (data.value[0] && data.value[0]?.primary[index]?.show) {
      hideSubMenu();
    } else {
      showSubMenu(index)
    }
  }
}

function mouseEnterHandler(isDropdown, index) {
  if (!isMobile.value) {
    showSubMenu(index);
  }
}
function mouseLeaveHandler() {
  if (!isMobile.value) {
    hideSubMenu();
  }
}
// Show submenu
const showSubMenu = (index) => {
  hideSubMenu();
  if (data.value[0] && data.value[0]?.primary[index]) {
    data.value[0].primary[index].show = true;
  }
  activeIndex.value = index;

  link.value[activeIndex.value].$el.parentElement.classList.add('active')

}
// Hide submenu
const hideSubMenu = () => {
  if ( data.value[0] && data.value[0]?.primary[activeIndex.value]) {
    data.value[0].primary[activeIndex.value].show = false;
  }

  link.value[activeIndex.value].$el.parentElement.classList.remove('active')
}


function showHideSearch() {
  showSearch.value = !showSearch.value;
  if (mobileMenuOpened.value) {
    showHideMenu()
  }
}


function showHideMenu() {

  if (menu_wrapper.value.classList.contains('hide')) {
    showSearch.value = false;

    mobileMenuOpened.value = true;
    menu_wrapper.value.classList.remove('hide');
    document.body.classList.add('no-mobile-scroll')
  } else {
    mobileMenuOpened.value = false;
    menu_wrapper.value.classList.add('hide')
    document.body.classList.remove('no-mobile-scroll')
  }
}

// Check if menu item has submenu
const hasSubMenu = (item) => {
  return item.collections || item.items?.length > 0
};


const enterAnimation = (e) => enter(e, isMobile)
const leaveAnimation = (e) => leave(e, isMobile)


onMounted(() => {



  // Mouse leave
  const navigation = window.document.getElementsByClassName('nav')[0]
  navigation.addEventListener("mouseleave", function (e) {
    hideSubMenu();
  }, {passive: true})



  // Before mount each route Remove all active classes
  addRouteMiddleware(async (to) => {
    hideSubMenu();
    mobileMenuOpened.value = false;
    menu_wrapper.value.classList.add('hide');
    document.body.classList.remove('no-mobile-scroll')
  });

});
</script>

<style scoped lang="scss">


.navigation {
  //height: 152px;
  width: 100%;
  position: relative;
  background-color: $dark-blue;
  color: $light-gray;
  z-index: 9;

  a {
    color: $light-gray;
    //opacity: .8;
  }

  ul {
    list-style-type: none;
    padding-inline-start: 0;
    margin-block-start: 0;
    margin-block-end: 0;
  }
}

.nav-icon {
  position: relative;
  display: inline-block;
  font-size: 24px;
  padding: 8px;
  text-decoration: none;
  margin: 0 8px;
  z-index: 10;
  color: rgb($light-gray, .8);
  cursor: pointer;
  &:hover {
    color: $light-gray;
  }

  &:last-child {
    margin-right: unset;
  }


}

.nav-link {
  line-height: 1em;
  padding: 16px 20px;
  text-align: center;
}

.top-nav .nav-link__tertiary {
  padding: 8px 0;
  margin: 0 16px;
}


.active-line {
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  width: calc(100% - 40px);
}

.active-line:after {
  content: '';
  position: absolute;
  height: 1px;
  background-color: $light-gray;
  top: 8px;
  width: 100%;
  z-index: 10;
}




// Line showing
.show-line-enter-active, .show-line-leave-active {
  transition: all .4s ease-out;
}

.show-line-enter-from, .show-line-leave-to {
  width: 0;
  margin-left: 50%;
}



.menu_wrapper {
  display: block;
  height: auto;
}


@include md {
  .navigation {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateY(0);
    transition: transform .3s ease;
    &.shift {
      transform: translateY(-56px);
    }
  }
  .nav {
    margin: 0;
    padding: 32px 0;
  }
  .nav-link {
    padding: 20px 0px;
    border-bottom: 1px solid $border-light;
    text-align: left;
  }


  li > .nav-link.dropdown:after {
    content: "\e90a";
    font-family: 'icomoon' !important;
    speak: never;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    font-size: 1em;
    position: absolute;
    right: 0;
    //margin-left: 0.4em;
  }
  li.active > .nav-link.dropdown:after {
    content: "\e90b";
    right: 32px;
  }


  li.active > .nav-link {
    transition-property: color;
    background-color: $light-gray;
    font-weight: bold;
    color: $dark-blue;
    margin-left: -32px;
    margin-right: -32px;
    padding-left: 32px !important;
    padding-right: 32px !important;
  }

  li.active > .nav-dropdown-container > .nav-dropdown {
    border-bottom-color: $light-gray;
  }
  .active-line, .active-line:after {
    all: unset;
  }


  .menu_wrapper {
    margin-left: -32px;
    padding: 0 32px 30vh;
    height: 100vh;
    width: calc(100% + 64px);
    overflow-y: scroll;
    transition: .4s;
  }
  .menu_wrapper.hide {
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}

@media (min-width: map-get($breakpoints, "md-min")) {
  .mobile-menu {
    display: none !important;
  }
}
</style>
