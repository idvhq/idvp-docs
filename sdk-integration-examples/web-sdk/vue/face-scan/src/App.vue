<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div>
    <a href="https://idverse.com" target="_blank">
      <img src="/logo.svg" class="logo" alt="Idverse logo" />
    </a>
  </div>
  <HelloWorld />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
</style>
