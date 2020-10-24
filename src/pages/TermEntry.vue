<template>
  <h1>{{ entry.content[$i18n.locale]?.preferredTerm }}</h1>
</template>

<script>
export default {
  name: "TermEntry",
  data() {
    return {
      entry: {},
    }
  },
  created() {
    this.$sanity
      .fetch(`*[_id == $id][0]`, { id: this.$route.params.id })
      .then((entry) => (this.entry = entry))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
