<template>
  <header>
    <nav class="flex justify-evenly">
      <button @click="$i18n.locale = 'de'">Deutsch</button>
      <button @click="$i18n.locale = 'fr'">Français</button>
      <button>Italieno</button>
    </nav>
  </header>
</template>

<script>
export default {
  methods: {
    name() {},
  },
}
</script>
