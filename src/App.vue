<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import MainView from './components/MapView.vue'
import TheNavigation from './components/TheNavigation.vue';
</script>

<template>
  <VApp>
    <TheNavigation></TheNavigation>

    <VMain>
        <MainView 
        class="pa-2" 
        />
    </VMain>
  </VApp>
</template>

<style scoped>

</style>
