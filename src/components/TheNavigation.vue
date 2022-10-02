<script setup lang="ts">
import { computed } from 'vue'
import useStore from '../store'

const { store, navUp, navRight, navDown, navLeft } = useStore()

const matrixRows =  computed(() => store.matrix.length);
const matrixCols =  computed(() => store.matrix[0].length);

</script>

<template>
  <VNavigationDrawer
    permanent
    width="300"
  >
    <VCard>
      <VCardTitle>Navigation</VCardTitle>
      <VCardSubtitle>
        {{ matrixRows }} x {{ matrixCols }}
      </VCardSubtitle>
      <VCardText>

      </VCardText>
      <VCardText>
        <div
         tag="section"
         aria-label="Navigation joystick"
          class="joystick justify-center align-items-center mb-3"
          >
          <VBtn icon="mdi-arrow-up-bold" data-up @click="navUp"></VBtn>
          <VBtn icon="mdi-arrow-left-bold" data-left @click="navLeft"></VBtn>
          <VBtn icon="mdi-arrow-right-bold" data-right @click="navRight"></VBtn>
          <VBtn icon="mdi-arrow-down-bold" data-down @click="navDown"></VBtn>
        </div>        
      </VCardText>
      <VCardSubtitle>
        Item
      </VCardSubtitle>
      <VCardText class="d-flex">
          <VTextField 
            v-model="store.currentBlock.row"
            label="Row"
            type="number"
            :min="0"
            :max="matrixRows - 1"
          />

          <VTextField
            v-model="store.currentBlock.col"
            label="Col"
            type="number"
            :min="0"
            :max="matrixCols - 1"
          ></VTextField>
      </VCardText>

      <VDivider />

      <!-- options -->
      <VCardTitle>Options</VCardTitle>
      <VCardSubtitle>Start point</VCardSubtitle>
      <VCardText>        
          <VTextField
          v-model="store.startPoint[0]"
          label="Lat"
        ></VTextField>
        <VTextField
          v-model="store.startPoint[1]"
          label="Lng"
        ></VTextField>
      </VCardText>

      <VCardSubtitle>End point</VCardSubtitle>
        <VCardText>
          <VTextField
          v-model="store.endPoint[0]"
          label="Lat"
        ></VTextField>
        <VTextField
          v-model="store.endPoint[1]"
          label="Lng"
        ></VTextField>
        </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>

<style scoped>
  .joystick {
    display: grid;
    grid-template-areas: ". up ."
    "left . right"
    ". down ."
    ;

    /* place-items: center; */
  }

  .joystick button[data-up] {
    grid-area: up
  }

  .joystick button[data-left] {
    grid-area: left
  }

  .joystick button[data-right] {
    grid-area: right
  }

  .joystick button[data-down] {
    grid-area: down
  }
</style>