<template>
  <HeaderSearchModalNew  :show="showSearch" @close="showSearch = false"/>

<!--  <transition name="fade">-->
<!--    <HeaderWishCounter v-if="$route.name !== 'moodboard'"  class="show-md"/>-->
<!--  </transition>-->
  <header class="navigation">

    <div class="container" style="position: static;">
      <div class="top-nav">
        <div class="left-side" v-if="data && data[0]">
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
        <div class="nav-wrap">
          <div class="nav" v-if="data && data[0]">
            <ul v-for="(item, index) in data[0]['primary']" class="nav-container">
              <li>
                <NuxtLink
                    ref="link"
                    :to="!(hasSubMenu(item) && isMobile) ? localePath(item.url) : null"
                    :target="item.target ? '_blank' : '_self'"
                    :class="(item.target ? 'nav-link hover target' : 'nav-link hover') + (hasSubMenu(item) ? ' dropdown' : '')"
                    v-on:click="navClickHandler(item, index)"
                    @mouseenter="mouseEnterHandler(hasSubMenu(item), index)"
                >
                  {{ item.title }}
                </NuxtLink>
  
  
                <Transition name="show-line">
                  <div class="active-line" v-if="(item.show ?? false) && (hasSubMenu(item))"></div>
                </Transition>
                <div class="nav-dropdown-container" v-if="hasSubMenu(item)" ref="dropdown">
                  <Transition name="slide-fade" @enter="enterAnimation" @leave="leaveAnimation">
                    <HeaderDropdown v-show="item.show && !isMobile" :item="item" :lines="data[1]" :show="item.show ?? false"/>
                  </Transition>
                </div>
              </li>
            </ul>
  
            <div class="m-v-32 show-md" v-if="data && data[0]">
              <NuxtLink
                  v-for="item in data[0]['primary_additional']" :to="item.url"
                  style="display: block"
                  :class="'nav-link__tertiary hover p-v-8 m-v-4' + (item.target ? ' target' : '')"
                  :target="item.target ? '_target' : '_self'">{{item.title}}
              </NuxtLink>
            </div>
  
          </div>
          <Transition name="slide">
            <div class="nav--mobile" v-if="activeItem">
              <div
                      class="nav-link hover nav-mobile__title"
                      v-on:click="navClickHandler(activeItem, index)"
                  >
                    {{ activeItem.title }}
            </div>
              <HeaderDropdown v-show="activeItem.show && isMobile" :item="activeItem" :lines="data[1]" :show="activeItem?.show ?? false"/>
            </div>
          </Transition>
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


const activeItem = ref(null)

// On mobile click to submenu open
function navClickHandler(item, index) {
  activeItem.value = activeItem.value?.url === item.url ? null : item;
  const isDropdown = hasSubMenu(item);
  if (isMobile.value && isDropdown) {
    const scrollWidth = window.innerWidth * 91
    if (!!activeItem.value && isDropdown) {
      menu_wrapper.value.scrollBy({left: scrollWidth, behavior: "smooth"})
    } else {
      menu_wrapper.value.scrollBy({left: -scrollWidth, behavior: "smooth"})
    }
    if (data.value && data.value[0] && data.value[0]?.primary[index]?.show) {
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
  if (data.value && data.value[0] && data.value[0]?.primary[index]) {
    data.value[0].primary[index].show = true;
  }
  activeIndex.value = index;

  link?.value[activeIndex?.value]?.$el?.parentElement?.classList?.add('active')

}
// Hide submenu
const hideSubMenu = () => {
  if (isMobile.value) {
    return
  }
  if (data.value && data.value[0] && data.value[0]?.primary[activeIndex.value]) {
    data.value[0].primary[activeIndex.value].show = false;
  }

  link.value[activeIndex.value].$el.parentElement?.classList.remove('active')
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
  return item?.collections || item?.items?.length > 0
};


const enterAnimation = (e) => enter(e, isMobile)
const leaveAnimation = (e) => leave(e, isMobile)


onMounted(() => {
  // Mouse leave
  const element = window.document.getElementsByClassName('nav')
  if (!element) {
    return
  }
  const navigation = element[0]
  navigation?.addEventListener("mouseleave", function (e) {
    hideSubMenu();
  }, {passive: true})



  // Before mount each route Remove all active classes
  addRouteMiddleware(async (to) => {
    hideSubMenu();
    mobileMenuOpened.value = false;
    menu_wrapper.value?.classList.add('hide');
    document.body.classList.remove('no-mobile-scroll')
  });

});
</script>

<style scoped lang="scss">
@use "header" as *;
</style>
