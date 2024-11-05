import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/'],
          },
      hooks: {
        async 'prerender:routes' (routes) {
            const pagesToIgnore = [
                "/inspiration", '/pl/inspiracja', 
                '/moodboard', '/pl/moodboard', 
                '/news', '/pl/aktualnosci', 
                '/press-about-us', '/pl/prasa', 
                '/request-an-appointment', 
                '/newsletter', 
                '/store-finder', '/pl/wyszukiwarka-sklepow',
            ]
            return Array.from(routes).filter(route => !route.includes('?') && && !pagesToIgnore.includes(route))
          },
      },
    },
  });
  