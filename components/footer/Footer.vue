<template>
  <div class="footer m-t-120 m-t-80-md p-v-16 white">
    <div class="container row-reverse-md m-t-80 m-t-40-md">
      <div class="row gap-S">
        <div class="col-6 col-4-xl col-12-lg p-v-0">
          <div class="h2 white m-t-0 hide-md">{{ translations.footer_title}}</div>
          <div class="m-v-40">
            <NuxtLink v-for="item in social" :class="'icon-'+item.icon" :to="item.url" target="_blank"
                      class="social white hover m-r-16 m-h-8-md m-b-16"/>
          </div>
        </div>

        <div class="col-6 col-8-xl col-12-lg p-v-4 menu">
          <div v-for="item in menu" class="sub-menu navigation">
            <div class="m-b-24">
              <NuxtLink :to="item.url" :target="item.target ? '_blank' : '_self'" class="nav-link hover white"
                        :class="item.target ? 'target' : ''">
                {{ item.title }}
              </NuxtLink>
            </div>
            <div :class="$divideSubMenu(item.items).length > 0 ? 'm-b-40' : ''" class="hide-md">
              <div v-for="subMenu in $divideSubMenu(item.items)" class="m-v-24">
                <div v-for="subItem in subMenu" class="m-v-4">
                  <NuxtLink :to="subItem.url" :target="subItem.target ? '_blank' : '_self'" class="p-small white hover"
                            :class="subItem.target ? 'target' : ''">{{ subItem.title }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="col-12 m-b-24 show-md"><div class="logo center"><Logo color="light"/></div></div>

      </div>
    </div>

    <div class="container m-t-80  m-b-40 m-t-40-md">
      <div class="row gap-S">
        <div class="col-6 col-12-md p-v-0 additional-items m-b-40-md">
          <NuxtLink v-for="item in additional" :to="item.url" :target="item.target ? '_blank' : '_self'" class="additional-item white m-v-8 m-v-16-md m-r-80 m-h-0-md">
            <div class="additional-logo">
              <div class="ratio-1x1">
                <Image v-if="item.logo" :path="item.logo" size="thumbnail" :alt="item.title"/>
              </div>
            </div>
            <div>
              <div class="description">{{ item.description }}</div>
              <div class="p-small target">{{ item.title }}</div>
            </div>
          </NuxtLink>
        </div>

        <div class="col-6 col-12-md p-v-0">
          <div class="copyright">
            <div class="copyright-text m-r-24 m-r-0-md">
              <span>Copyright © {{new Date().getFullYear()}} MillaNova. All rights reserved. </span>
              <br>
              <span>Made by </span><NuxtLink to="https://sarakuz.com" target="_blank" class="white">Sarakuz</NuxtLink>
            </div>

            <div class="logo hide-md"><Logo color="light"/></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useMenuData, useTranslationsData} from "~/composables/states";

const menu = useMenuData().value[0].primary
const translations = useTranslationsData().value
const social = useMenuData().value[0].social
const additional = useMenuData().value[0].footer_additional


</script>

<style scoped lang="scss">
@import  "/assets/style/global.scss";

.footer {
  width: 100%;
  background-color: $dark-blue;
}

.menu {
  column-count: 3;
  column-gap: 40px;
}

.sub-menu {
  break-inside: avoid;
  page-break-inside: avoid;
}

.social {
  font-size: 20px;
  height: 24px;
  display: inline-block;
  width: 24px;
  padding: 2px;
}
.logo {
  width: 56px;
}
.copyright {
  display: flex;
  justify-content: flex-end;
  align-items: center;



  .copyright-text {
    span {
      opacity: .4;
    }

    text-align: right;
    font-size: 13px;
  }
}

.nav-link {
  display: inline-block;
}
.router-link-active:after {
  content: '';
  position: absolute;
  left: 0;
  top: 110%;
  width: 100%;
  height: 1px;
  background-color: $light-gray;
}
.additional-items {
  text-align: left;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.additional-item {
  display: flex;
  align-items: center;
}
.additional-logo {
  width: 32px;
  display: inline-block;
  margin-right: 16px;
}
.description {
  font-size: 12px;
  opacity: .5;
  margin-bottom: 2px;
}

@include md {
  .footer {
    text-align: center;
  }
  .menu {
    column-count: 1;
  }
  .social {
    font-size: 22px;
    height: auto;
    width: auto;
    padding: 12px;
    border: 1px solid $border-light;
  }
  .row-reverse-md  .row {
    flex-direction: column-reverse;
  }

  .logo {
    width: 64px;
    margin: auto;
  }
  .copyright {
    justify-content: center;
    .copyright-text {
      text-align: center;
    }
  }
  .additional-items {
    flex-direction: column;
  }
}
</style>
