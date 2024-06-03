<template>
  <div>
    <button @click="showDrawer = true">Open Drawer</button>
    <DrawerCompo  v-model="showDrawer">
      <p>This is the content inside the drawer</p>
    </DrawerCompo>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DrawerCompo from './drawer-compo.vue';

const showDrawer = ref(false);
</script>

<style scoped>
button {
  margin: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
