<template>
  <HeaderWishCounter v-if="isMobile"/>
  <header class="navigation">
    <div class="container">

      <div class="top-nav">
        <div class="left-side">
          <NuxtLink to="/1" class="nav-link__tertiary hover hide-md">Trunk shows</NuxtLink>
          <NuxtLink to="/1" class="nav-link__tertiary target hover hide-md">White&Lace Store</NuxtLink>
          <div v-on:click="showHideMenu" class="nav-icon hover mobile-menu">
            <div class="icon-menu-24"></div>
          </div>
        </div>

        <!-- Logo-->
        <NuxtLink to="/" class="logo-container">
          <img src="@/assets/img/logo.svg" alt="MillaNova Logo" class="logo">
        </NuxtLink>

        <div class="right-side">
          <HeaderWishCounter v-if="!isMobile"/>
          <NuxtLink to="/" class="nav-icon hover">
            <div class="icon-search-24"></div>
          </NuxtLink>
        </div>
      </div>

      <div ref="menu_wrapper" class="menu_wrapper hide">
        <div class="nav">
          <ul v-for="(item, index) in menu" class="nav-container">
            <li>
              <NuxtLink
                  ref="link"
                  :to="!(hasSubMenu(item) && isMobile) ? item.url : false"
                  :target="item.target ? '_blank' : '_self'"
                  :class="(item.target ? 'nav-link hover target' : 'nav-link hover') + (hasSubMenu(item) ? ' dropdown' : '')"
                  v-on:click="navClickHandler(hasSubMenu(item), index)"
                  @mouseenter="mouseEnterHandler(hasSubMenu(item), index)"
                  @mouseleave="mouseLeaveHandler"
              >
                {{ item.title }}
              </NuxtLink>

              <!--                  @click="navClickHandler(item.url, hasSubMenu(item))"-->

              <Transition name="show-line">
                <div class="active-line" v-if="(item.show ?? false) && (hasSubMenu(item))"></div>
              </Transition>
              <div class="nav-dropdown-container" v-if="hasSubMenu(item)" ref="dropdown">
                <Transition name="slide-fade" @enter="enterAnimation" @leave="leaveAnimation">
<!--                  <HeaderDropdown v-show="true" :item="item" :lines="lines"/>-->
                  <HeaderDropdown v-show="item.show ?? false" :item="item" :lines="lines"/>
                </Transition>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>


  </header>
</template>

<script setup lang="ts">
const data = useMenuData();
const {menu, lines} = {menu: data.value[0].primary, lines: data.value[1]};
const isMobile = useIsMobile();
let activeIndex = ref(0);
const dropdown = ref();
const link = ref();
const menu_wrapper = ref();



// On mobile click to submenu open
function navClickHandler(isDropdown, index) {
  if (isMobile.value && isDropdown) {
    if (menu[index].show) {
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
  menu[index].show = true;
  activeIndex.value = index;

  link.value[activeIndex.value].$el.parentElement.classList.add('active')
}
// Hide submenu
const hideSubMenu = () => {
  menu[activeIndex.value].show = false;

  link.value[activeIndex.value].$el.parentElement.classList.remove('active')
}





function showHideMenu() {
  if (menu_wrapper.value.classList.contains('hide')) {
    menu_wrapper.value.classList.remove('hide')
  } else {
    menu_wrapper.value.classList.add('hide')
  }
}

// Check if menu item has submenu
const hasSubMenu = (item) => {
  return item.collections || item.items.length > 0
};




function enterAnimation(element) {
  if (!isMobile.value) return
  element.style.height = 0;
  const height = element.children[0].getBoundingClientRect().height;
  requestAnimationFrame((e) => {
    element.style.height = height + 'px';
  });
}

function leaveAnimation(element) {
  if (!isMobile.value) return

  requestAnimationFrame(() => {
    element.style.height = 0;
  });
}


onMounted(() => {



  // Mouse leave
  const navigation = window.document.getElementsByClassName('nav')[0]
  navigation.addEventListener("mouseleave", function (e) {
    hideSubMenu();
  })



  // Before mount each route Remove all active classes
  addRouteMiddleware(async (to) => {
    hideSubMenu();
    menu_wrapper.value.classList.add('hide');
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

//Fade showing
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .4s ease-out;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
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
