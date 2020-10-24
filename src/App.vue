<template>
  <TheHeader />

  <ul>
    <li v-for="entry in entries" :key="entry._id">
      {{ entry.content[$i18n.locale]?.preferredTerm }}
    </li>
  </ul>
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
  data() {
    return {
      entries: [],
    }
  },
  components: {
    TheHeader,
  },
  created() {
    client
      .fetch(`*[_type == "entry"]{_id, content{ de, fr }}`)
      .then((entries) => (this.entries = entries))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
