<template>
  <ul>
    <li v-for="entry in entries" :key="entry._id">
      <router-link :to="`/term/${entry._id}`">{{
        entry.content[$i18n.locale]?.preferredTerm
      }}</router-link>
    </li>
  </ul>
</template>

<script>
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
  name: "Home",
  data() {
    return {
      entries: [],
    }
  },
  created() {
    this.$sanity
      .fetch(query)
      .then((entries) => (this.entries = entries))
      .catch((err) => console.error("Oh noes: %s", err.message))
  },
}
</script>
