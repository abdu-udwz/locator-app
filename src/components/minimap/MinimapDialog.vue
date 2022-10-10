<script setup lang="ts">
import useStore from '../../store'
import TheMinimap from './TheMinimap.vue';

const { store } = useStore()
</script>

<template>
  <VDialog 
    v-model="store.minimapDialog"
    scrollable
    width="80vw"
    persistent
  >
    <VCard >
      <VCardTitle>Minimap</VCardTitle>
      <VCardText class="d-flex align-center">
        <VCard 
          color="red"
          width="200px"
          height="200px"
        >
        </VCard>

        <VDivider vertical class="mx-3"/>

        <TheMinimap style="max-height: 400px;"/>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="store.minimapDialog = false">
          close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>