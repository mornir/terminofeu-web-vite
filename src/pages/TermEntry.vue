<template>
  <h1>{{ entry.content?.[$i18n.locale]?.preferredTerm }}</h1>

  <p>{{ entry.content?.[$i18n.locale]?.additionnalFields[0].definition }}</p>

  <SanityContent
    :blocks="entry.content?.[$i18n.locale]?.additionnalFields[0].definition"
  />
</template>

<script>
import { SanityContent } from "../components/sanity-content.ts"

export default {
  name: "TermEntry",
  data() {
    return {
      entry: {},
    }
  },
  components: {
    SanityContent,
  },
  created() {
    this.$sanity
      .fetch(`*[_id == $id][0]`, { id: this.$route.params.id })
      .then((entry) => (this.entry = entry))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
