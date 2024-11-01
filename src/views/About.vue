<script setup lang="ts">
import { ref } from 'vue'

const title = ref('About Page')
</script>

<template>
  <div class="about">
    <h1>{{ title }}</h1>
  </div>
</template>

<style lang="scss" scoped>
.about {
  padding: 20px;
  text-align: center;
}
</style>