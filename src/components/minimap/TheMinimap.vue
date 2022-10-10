<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RecycleScroller  } from 'vue-virtual-scroller'
import MinimapRow from './MinimapRow.vue'
import useBlockStyles from '../../composables/blockStyles';


import useMission from '../../mission'
import useNavigation from '../../navigation'

const props = withDefaults(defineProps<{
  blockSize?: number
}>(), {
  blockSize: 60
})

const { missionStore } = useMission()
const { matrixCols, updateCurrentBlock } = useNavigation()

const mission = toRef(missionStore, 'mission')
const blocksRows = computed(() => {
  return mission.value.matrix.map((row, index) => {
    return {
      blocks: row,
      id: `minimap-row-${index}`
    }
  })
})

const { size: blockSizeStyles } = useBlockStyles(toRef(props, 'blockSize'))

</script>

<template>
<div 
  class="minimap overflow-auto"
>
  <!-- the left padding is to take place of the "header row cell" -->
  <div 
    class="minimap-header d-flex"
    :style=" { paddingLeft: `${blockSize}px` }"
  >
    <VSheet
      v-for="col in matrixCols"
      :key="`col-${col -1}`"
      :style="blockSizeStyles"
      class="mx-1 d-flex justify-center align-center"
      variant="flat"
    >{{ col - 1}}</VSheet>
  </div>

  <RecycleScroller
    :items="blocksRows"
    :item-size="props.blockSize + 16"
    :style="{ width: `${(props.blockSize + 10) * matrixCols }px` }"
  >
    <template #default="{ item, index }">
      <MinimapRow 
        :blocks="item.blocks"
        :index="index"
        :block-size="blockSize"
        @click:block="updateCurrentBlock"
      />
    </template>
  </RecycleScroller>
</div>
</template>