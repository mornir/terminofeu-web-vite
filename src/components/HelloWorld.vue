<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p class="text-xl text-red-500">
    Edit <code>components/HelloWorld.vue</code> to test hot replacement.
  </p>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      count: 0,
    }
  },
}
</script>
