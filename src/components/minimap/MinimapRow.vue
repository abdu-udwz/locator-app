<script setup lang="ts">
import { computed, toRef } from 'vue'
import useBlockStyles from '../../composables/blockStyles'
// types
import type  { LocatorBlock } from '.././../types'

interface Props {
  index: number,
  blocks: LocatorBlock[]
  blockSize: number
}

const props = withDefaults(defineProps<Props>(), {
  blocks: () => []
})

defineEmits<{
  (event: 'click:block', rowIndex: number, colIndex: number): void
}>()


const { 
  size: blockSizeStyles,
  priorityColors,
} = useBlockStyles(toRef(props, 'blockSize'))
const blockStyles = computed(() => {
  return {
    ...blockSizeStyles.value, 
    cursor: 'pointer'
  }
})
</script>

<template>
<div class=d-flex>
  <span 
    :style="blockSizeStyles"
    class="d-flex justify-center align-center"
  > {{ index }}</span>
  <VSheet
    v-for="(block, colIndex) of blocks"
    :key="colIndex"
    :color="priorityColors[block.priority]"
    :title="`${block.coordinates[0]}, ${block.coordinates[1]}`"
    
    class="mx-1"
    :style="blockStyles"
    
    variant="outlined"
    border

    @click="$emit('click:block', index, colIndex)"
  ></VSheet>
</div>
</template>