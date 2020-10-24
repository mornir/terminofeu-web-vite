<template>
  <TheHeader />
  <p>{{ $t("hello") }}</p>
</template>

<script>
import PicoSanity from "picosanity"
import TheHeader from "./components/SingleInstance/TheHeader.vue"

const client = new PicoSanity({
  projectId: "nipfx4rq",
  dataset: "production",
  useCdn: true,
})

export default {
  name: "App",
  components: {
    TheHeader,
  },
  created() {
    client
      .fetch(`*[_type == "entry"]`)
      .then((entries) => console.log(entries))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
