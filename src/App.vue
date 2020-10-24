<template>
  <TheHeader />
  <p>{{ $t("hello") }}</p>
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
