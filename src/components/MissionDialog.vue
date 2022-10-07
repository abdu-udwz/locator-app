<!-- 
  A dialog to create/edit mission data
 -->
<script setup lang="ts">
import { toRef, watch, watchEffect } from 'vue';
import type { WatchStopHandle } from 'vue';
import useStore from '../store'
import useMission from '../mission'

const  { store } = useStore()
const { missionStore, saveMission, updateMissionsList, generateBlocksMatrix } = useMission()

const dialog = toRef(missionStore, 'dialog')

/*
 * 
 */
let areaWatchHandle: WatchStopHandle | null = null
watch(() => dialog.value.visible, (newVal) => {
  if (newVal) {
    dialog.value.regenerateMatrix = false

    areaWatchHandle = watch([
      () => dialog.value.mission.startPoint,
      () => dialog.value.mission.endPoint
    ], () => {
      dialog.value.regenerateMatrix = true
    },  { deep: true } )

  } else {
    if (areaWatchHandle != null) {
      areaWatchHandle()
    }
  }
},)

function onSave (): void {
  if (dialog.value.regenerateMatrix || dialog.value.newMission) {

    const viewportBounding = store.mapViewFrame!.getBoundingClientRect()

    dialog.value.mission.matrix = generateBlocksMatrix({
        startPoint: dialog.value.mission.startPoint,
        endPoint: dialog.value.mission.endPoint,
      },
      {
        width: viewportBounding.width,
        height: viewportBounding.height
      }
    ) 
  }
  
  saveMission(dialog.value.mission)
  dialog.value.visible = false

  if (dialog.value.newMission) {
    dialog.value.newMission = false
    updateMissionsList()
  }
}

function onCancel (): void {
  dialog.value.visible = false
}
</script>

<template>
<VDialog
  v-model="dialog.visible"
>
  <VCard>
    <VCardTitle>Mission</VCardTitle>
    
    <VCardText>
      <VTextField
        v-model="dialog.mission.title"
        label="Title"
      />
    </VCardText>

    <VCardSubtitle>Start point</VCardSubtitle>
    <VCardText>
      <VRow>        
        <VTextField
          v-model="dialog.mission.startPoint[0]"
          label="Latitude"
          class="v-col v-col-lg-6"
        />
        <VTextField
          v-model="dialog.mission.startPoint[1]"
          label="Longitude"
          class="v-col v-col-lg-6"
        />
      </VRow>
    </VCardText>

    <VCardSubtitle>End point</VCardSubtitle>
    <VCardText>
      <VRow>
        <VTextField
          v-model="dialog.mission.endPoint[0]"
          label="Latitude"
          class="v-col v-col-lg-6"

        />
        <VTextField
          v-model="dialog.mission.endPoint[1]"
          label="Longitude"
          class="v-col v-col-lg-6"
        />
      </VRow>

      <VAlert 
        v-show="!dialog.newMission && dialog.regenerateMatrix"
        type="warning"
        title="Possible loss of blocks data"
      >
        The area details of the mission has been updated (start point/end point). Saving the changes will cause all of the mission data to be overwritten
      </VAlert>
    </VCardText>

    <VCardActions>
      <VSpacer />
      <VBtn
        @click="onCancel"
      >Cancel</VBtn>
      <VBtn 
        color="primary"
        variant="flat" 
        @click="onSave"
      >Save</VBtn>
    </VCardActions>
  </VCard>
</VDialog>
</template>