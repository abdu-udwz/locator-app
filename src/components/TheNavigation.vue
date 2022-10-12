<script setup lang="ts">
import TheMinimap from './minimap/TheMinimap.vue'

import useStore from '../store'
import useMission from '../mission'
import useNavigation from '../navigation'
import useBlocksStyles from '../composables/blockStyles'

const { store } = useStore()

/*
 * Mission
 */
const { 
  missionStore, 
  updateMissionsList,
  showNewDialog: showNewMissionDialog
 } = useMission()

updateMissionsList()

const { 
  currentBlockIndex,
  currentBlock,
  matrixCols,
  matrixRows,
  navUp, navRight, navDown, navLeft,
  updateCurrentBlock
} = useNavigation()

function onIndexFieldUpdated(row: string | number, col: string | number): void {
  updateCurrentBlock(
    typeof row === 'number' ? row : parseFloat(row), 
    typeof col === 'number' ? col : parseFloat(col)
    )
}

const { priorityColors: blockPriorityColors } = useBlocksStyles()

</script>

<template>
  <VNavigationDrawer
    permanent
    width="300"
  >
    <VCard v-if="currentBlock != null">
      <VCardTitle>Navigation</VCardTitle>
        <VCardSubtitle>
          {{ matrixRows }} x {{ matrixCols }}
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
              :model-value="currentBlockIndex.row"
              label="Row"
              type="number"
              :min="0"
              :max="matrixRows - 1"
              @update:model-value="onIndexFieldUpdated($event, currentBlockIndex.col)"
            />

            <VTextField
              v-model="currentBlockIndex.col"
              label="Col"
              type="number"
              :min="0"
              :max="matrixCols - 1"
              @update:model-value="onIndexFieldUpdated(currentBlockIndex.row, $event)"
            ></VTextField>
        </VCardText>
        
        <!-- priority control -->
        <VCardSubtitle>Block priority</VCardSubtitle>
        <VCardText>
          <VBtnToggle
            v-model="currentBlock.priority"
            variant="outlined"
            mandatory
            class="mb-6 w-100"
          >
            <VBtn 
              v-for="i in 5"
              :key="i"
              :value="i - 1"
              size="small"
              :color="blockPriorityColors[i - 1]"
            > {{ i - 1 }}</VBtn>
          </VBtnToggle>
        </VCardText>

        <!-- Minimap -->
        <VCardSubtitle>
          Mission Minimap
        </VCardSubtitle>
        <VCardText>
          <TheMinimap 
            :block-size="40"
            style="max-height: 200px;"
          />
        </VCardText>
        <VCardActions>
          <VBtn
            class="mt-2"
            block
            @click="store.minimapDialog = true"
          >
            Enlarge Minimap
          </VBtn>
        </VCardActions>

        <VCardText>
          <VTextarea 
            v-model="currentBlock.note"
            label="Block notes"
            rows="2"
            auto-grow
          />
        </VCardText>

        <VCardSubtitle>
          Block details
        </VCardSubtitle>
        <VCardText>
          <VTable>
            <tbody>
              <tr>
                <th>Latitude</th>
                <td>{{ currentBlock.coordinates[0]}}</td>
              </tr>
              <tr>
                <th>Longitude</th>
                <td> {{ currentBlock.coordinates[1] }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
    </VCard>

    
    <!-- mission -->
    <VCard>
      <VDivider />
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