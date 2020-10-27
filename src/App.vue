<template>
  <div class="px-16 prose lg:prose-xl">
    <TheHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useSanityClient } from "vue-sanity"
import TheHeader from "./components/SingleInstance/TheHeader.vue"

export default {
  name: "App",
  components: {
    TheHeader,
  },
  setup() {
    useSanityClient({
      projectId: "nipfx4rq",
      dataset: "production",
      useCdn: process.env.NODE_ENV === "production",
    })
  },
}
</script>
