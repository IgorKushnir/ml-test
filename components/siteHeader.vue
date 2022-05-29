<template>
  <div>
    <div class="menu">
      <div class="container">
        <div class="top-nav-container">
          <div class="left-side">
            <NuxtLink to="/1" class="nav-link-tertiary">Trunk shows</NuxtLink>
            <NuxtLink to="/1" class="nav-link-tertiary">White&Lace Store <i class="icon-taget-16"/></NuxtLink>
          </div>


          <div class="right-side">
            <NuxtLink to="/" class="nav-icon wish-icon">
              <div class="icon-heart-no-24">
                <div class="wish-counter">{{ counter }}</div>
              </div>
            </NuxtLink>
            <NuxtLink to="/" class="nav-icon">
              <div class="icon-search-24"></div>
            </NuxtLink>
          </div>
        </div>


        <NuxtLink to="/" class="logo-container">
          <img src="@/assets/img/logo.svg" alt="MillaNova Logo" class="logo">
        </NuxtLink>


        <div class="nav-container" v-if="menu">
          <div v-for="item in menu.primary" class="nav-link-wrapper">
            <NuxtLink :to="item.url" :target="item.target ? '_blank' : '_self'" class="nav-link">{{ item.title }}
            </NuxtLink>
            <div class="nav-dropdown" v-if="item.collections || item.items.length > 0">
              <div class="container">
                <div class="row gap-L">
                  <div class="col-4 hide-lg">
                    <div class="ratio-4x3">
                      <img src="https://millanova.com/wp-content/uploads/2022/04/MGL4658_1-2000x1333.jpg" alt="">
                    </div>
                  </div>
                  <div class="col-5 col-8-lg" v-if="item.collections">
                    <ul class="menu-collections">
                      <li v-for="line in lines" class="line">
                        <div class="subheader small">{{ line.attributes.title }}</div>
                        <ul>
                          <li v-for="collection in line.attributes.collections.data">
                            <NuxtLink :to="collection.attributes.slug" class="nav-link-tertiary">
                              {{ collection.attributes.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div class="col-3 col-4-lg sub-menu">
                    <ul class="sub-menu" v-if="divideSubMenu(item.items).length > 0" v-for="sub_menu in divideSubMenu(item.items)">
                      <li v-for="sub_item in sub_menu">
                        <NuxtLink :to="sub_item.url" :target="sub_item.target ? '_blank' : '_self'"
                                  class="nav-link-secondary">{{ sub_item.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">


// Define a counter
let counter = useFavCount();




</script>

<style scoped lang="scss">
.menu {
  background-color: $dark-blue;
  height: 152px;
  min-height: 152px;
  color: rgb($light-gray, .8);

  a {
    color: rgb($light-gray, .8);
  }
}

.menu > .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  padding: 8px;
  opacity: .95;
  /*background-color: black;*/
  display: inline-block;
  margin: 0 auto;

  &:hover {
    opacity: 1;
  }
}

.logo {
  height: 24px;
}

.top-nav-container {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.nav-container {
  display: flex;
  //flex-wrap: wrap;
  justify-content: center;
}

.nav-link:hover {
  color: $light-gray;
}

.nav-link-wrapper {
  .nav-link {
    display: block;
    margin: 0 20px;
    color: rgb($light-gray, .8);
    padding: 24px 0;

    transition: .3s;
    &:hover {
      color: $light-gray;
    }
  }

  .nav-link:after {
    content: '';
    position: absolute;
    width: 0%;
    height: 1px;
    left: 50%;
    top: calc(100%);
    background-color: white;
    transition: .4s;
    z-index: 10;
  }
}

.nav-link-wrapper:hover {
  .nav-dropdown {
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    color: $white;
    position: relative;
  }

  .nav-link:after {
    width: 100%;
    left: 0;
  }
}





.nav-icon {
  position: relative;
  display: inline-block;
  font-size: 24px;
  padding: 8px;
  text-decoration: none;
  margin-right: 16px;

  color: rgb($light-gray, .8);

  &:hover {
    color: $light-gray;
  }

  &:last-child {
    margin-right: unset;
  }

  .wish-counter {
    position: absolute;
    top: 2px;
    right: 0;
    font-family: $font-family;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    background-color: $red;
    color: $white;
    min-width: 8px;
    height: 8px;
    padding: 4px;
    font-size: 11px;
    border-radius: 8px;
  }
}


.nav-dropdown {
  position: absolute;
  top: 152px;
  left: 0;
  width: 100%;
  //height: 500px;
  background-color: $dark-blue;
  z-index: 3;


  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: $border-light;

  transition: .3s;
  visibility: hidden;
  opacity: 0;

}


.menu-collections {
  padding: 0;
  margin: 0;
  list-style-type: none;
  column-count: 2;
  column-gap: 40px;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      margin-bottom: 16px;
    }
  }

  .line {
    margin-bottom: 32px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  a {
    text-decoration: none;
  }
}

.sub-menu {

  ul {
    padding: 0;
    margin: 0 0 40px 0;
    list-style-type: none;

    li {
      margin-bottom: 16px;
    }
  }
}

.subheader.small {
  opacity: .4;
}

@include md {
  .logo {
    height: 16px;
  }
  .logo-container {
    position: absolute;
    top: 0;
    padding: 20px;
  }
  .top-nav-container {
    height: 56px;
  }
  .menu {
    min-height: 56px;
    height: 56px;
  }

  .nav-icon.wish-icon {
    position: fixed;
    background-color: $white;
    color: $dark-blue !important;
    padding: 16px;
    border-radius: 28px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    margin: 0;
    bottom: 16px;
    right: 16px;

    .wish-counter {
      position: absolute;
      top: 0;
      right: -6px;
      font-size: 12px;
      border-radius: 10px;
      min-width: 12px;
      height: 12px;
      padding: 4px;
    }
  }
}

</style>
