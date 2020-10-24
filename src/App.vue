<template>
  <div class="px-16 prose lg:prose-xl">
    <TheHeader />
    <main>
      <router-view />
      <ul>
        <li v-for="entry in entries" :key="entry._id">
          {{ entry.content[$i18n.locale]?.preferredTerm }}
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import PicoSanity from "picosanity"
import TheHeader from "./components/SingleInstance/TheHeader.vue"

const client = new PicoSanity({
  projectId: "nipfx4rq",
  dataset: "production",
  useCdn: true,
})

const query = /* groq */ `*[_type == "entry"]
{
 _id,
 content {
   de,
   fr
 }
}
`

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
      .fetch(query)
      .then((entries) => (this.entries = entries))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
