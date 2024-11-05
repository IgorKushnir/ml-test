export default defineNuxtConfig({
    nitro: {
      hooks: {
        "prerender:generate"(route) {
          if (route.route?.includes("?")) {
            route.skip = true;
          }
        },
      },
    },
  });
  