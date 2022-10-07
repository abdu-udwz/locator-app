<script setup lang="ts">
import { computed } from 'vue'
import useStore from '../store'

const { store, navUp, navRight, navDown, navLeft } = useStore()

const highlightOptions = [
{
    value: 'NONE',
    text: 'None',
  },
  {
    value: 'FAVORITE',
    text: 'Favorite'
  },
  {
    value: 'IGNORED',
    text: 'Ignored'
  },
]

</script>

<template>
  <VNavigationDrawer
    permanent
    width="300"
  >
    <VCard>
      <VCardTitle>Navigation</VCardTitle>
      <VCardSubtitle>
        {{ store.matrixRows }} x {{ store.matrixCols }}
      </VCardSubtitle>

      <VCardText>
        <!-- zoom control -->
        <VTextField
          v-model="store.zoom"
          label="Zoom"
          type="number"
          prepend-inner-icon="mdi-magnify-plus"
          max="20"
        />

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
        Block index
      </VCardSubtitle>
      <VCardText class="d-flex">
          <VTextField 
            v-model="store.currentBlockIndex.row"
            label="Row"
            type="number"
            :min="0"
            :max="store.matrixRows - 1"
          />

          <VTextField
            v-model="store.currentBlockIndex.col"
            label="Col"
            type="number"
            :min="0"
            :max="store.matrixCols - 1"
          ></VTextField>
      </VCardText>
      <VCardSubtitle>
        Block details
      </VCardSubtitle>
      <VCardText>
        <VTable>
          <tbody>
            <tr>
              <th>Latitude</th>
              <td>{{ store.currentBlock.coordinates[0]}}</td>
            </tr>
            <tr>
              <th>Longitude</th>
              <td> {{ store.currentBlock.coordinates[1] }}</td>
            </tr>
          </tbody>
        </VTable>
        
      </VCardText>

      <VCardText>
        <!-- highlight control -->
        <VSelect
          v-model="store.currentBlock.highlight"
          :items="highlightOptions"
          item-value="value"
          item-title="text"
          label="Highlight"
          hint="Choose how to categorize this block"
        />

        <VTextarea 
          v-model="store.currentBlock.note"
          label="Block notes"
          rows="2"
          auto-grow
        />
      </VCardText>

      <VDivider />

    <!-- mission -->
    <VCard>
      <VCardTitle>Mission</VCardTitle>

      <VCardText>
        <VSelect 
          v-model="missionStore.missionKey"
          :items="missionStore.missions"
          item-value="id"
          item-title="title"
        />
      </VCardText>
      <VCardActions>
        <VBtn
          block
          @click="showNewMissionDialog"
        >
          New mission
        </VBtn>
      </VCardActions>
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