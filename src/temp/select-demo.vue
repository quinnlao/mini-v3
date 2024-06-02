<template>
  <div id="app">
    <h1>Vue Select Component</h1>
    <Select v-model="selected" :options="options" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Select from './select-compo.vue';

const selected = ref(null);
const options = ref([
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]);
</script>

<style>
</style>