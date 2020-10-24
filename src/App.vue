<template>
  <div class="px-16 prose lg:prose-xl">
    <TheHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import TheHeader from "./components/SingleInstance/TheHeader.vue"

export default {
  name: "App",
  components: {
    TheHeader,
  },
}
</script>
