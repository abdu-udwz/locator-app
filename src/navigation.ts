import { reactive, computed, toRef, watch, toRefs } from 'vue'
import useMission from './mission';
import type { LocatorBlock } from "./types";

const { missionStore } = useMission()
const mission = toRef(missionStore, 'mission')

const navUtils = reactive({
  currentBlockIndex: computed(() => mission.value.currentBlockIndex),
  currentBlock: computed((): LocatorBlock | null => {
    if (mission.value == null) { return null}

    const rowIndex = mission.value?.currentBlockIndex?.row
    if (rowIndex == null) { return null }

    const blocksRow = mission.value?.matrix[rowIndex]
    return blocksRow != null ? blocksRow[mission.value?.currentBlockIndex?.col] : null
  }),

  matrixRows:  computed((): number => mission.value?.matrix?.length ?? 0),
  matrixCols:  computed((): number => mission.value?.matrix[0]?.length ?? 0),
})

/* 
*  navigation (current block updates)
*/
watch(() => mission.value.currentBlockIndex, () => {
  if (navUtils.currentBlock != null && !navUtils.currentBlock?.visited) {
    navUtils.currentBlock.visited = true
  }
})

function updateCurrentBlock (row: number, col: number): void {
  if (row < 0) {
    row = 0
  } else if (row > mission.value.matrix.length - 1) {
    row = mission.value.matrix.length - 1
  }

  if (col < 0) {
    col = 0
  } else if (col > mission.value.matrix[0].length - 1) {
    col = mission.value.matrix[0].length - 1
  }

  mission.value.currentBlockIndex = {row, col}
}

function navUp() {
  updateCurrentBlock(mission.value.currentBlockIndex.row - 1, mission.value.currentBlockIndex.col)
}

function navRight () {
  let newCol = mission.value.currentBlockIndex.col +1
  let newRow = mission.value.currentBlockIndex.row
  if (mission.value.currentBlockIndex.col === navUtils.matrixCols - 1) {
    newCol = 0
    newRow++
  }

  updateCurrentBlock(newRow, newCol)
}

function navDown () {
  updateCurrentBlock(mission.value.currentBlockIndex.row + 1, mission.value.currentBlockIndex.col)
}

function navLeft () {
  let newCol = mission.value.currentBlockIndex.col - 1
  let newRow = mission.value.currentBlockIndex.row
  if (mission.value.currentBlockIndex.col === 0) {
    newCol = navUtils.matrixCols - 1
    newRow--
  }
  
  updateCurrentBlock(newRow, newCol)
}

export default function useNavigation() {
  return {
    ...toRefs(navUtils),

    navUp,
    navRight,
    navDown,
    navLeft,
    updateCurrentBlock,
}
}

