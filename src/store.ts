import { reactive, computed, watch } from 'vue'

import type { CoordinatesPair, LocatorBlock } from './types'

// stupidly measured but effective numbers ^_^
// each pixel sums up to 0.000002538 coordinate unit at zoom level 19
//
// TODO: make this ratio dynamic and take into account zoom levels other than 19
const mapToPixelRatio = 0.000002538

const store = reactive({
  zoom: 19,

  viewPort: {
    width: 100,
    height: 100,
  },

  blockWidth: computed((): number => store.viewPort.width * mapToPixelRatio),
  blockHeight: computed((): number => store.viewPort.height * mapToPixelRatio),

  currentBlockIndex: {row: 0, col: 0},
  currentBlock: computed((): LocatorBlock => {
    return store.matrix[store.currentBlockIndex.row][store.currentBlockIndex.col]
  }),

  startPoint: ['32.32715235751756', '15.08581394993159'],
  endPoint: ['32.193612259300686', '15.138809048123479'],

  matrix: computed((): LocatorBlock[][] =>  {
    const parsedStartPoint = store.startPoint.map(parseFloat)
    const parsedEndPoint = store.endPoint.map(parseFloat)

    const result: LocatorBlock[][] = []
    
    let currentRow =  parsedStartPoint[0]
    while (currentRow > parsedEndPoint[0]) {
      const blocksRow: LocatorBlock[] = []

      currentRow -= store.blockWidth
      let currentCol = parsedStartPoint[1]
      while (currentCol < parsedEndPoint[1]) {
        currentCol += store.blockHeight
        blocksRow.push({
          coordinates: [currentRow, currentCol],
          visited: false,
          highlight: 'NONE',
          note: '',
        })
      }

      result.push(blocksRow)
    }
    return result
  }),

  matrixRows:  computed((): number => store.matrix.length),

  matrixCols:  computed((): number => store.matrix[0].length),
})

watch(() => store.currentBlockIndex, () => {
  if (!store.currentBlock?.visited) {
    store.currentBlock.visited = true
  }
})

function updateCurrentBlock (row: number, col: number): void {
  if (row < 0) {
    row = 0
  } else if (row > store.matrix.length) {
    row = store.matrix.length
  }

  if (col < 0) {
    col = 0
  } else if (col > store.matrix[0].length) {
    col = store.matrix[0].length
  }

  store.currentBlockIndex = {row, col}
}

function navUp() {
  updateCurrentBlock(store.currentBlockIndex.row - 1, store.currentBlockIndex.col)
}


function navRight () {
  let newCol = store.currentBlockIndex.col +1
  let newRow = store.currentBlockIndex.row
  if (store.currentBlockIndex.col === store.matrixCols - 1) {
    newCol = 0
    newRow++
  }

  updateCurrentBlock(newRow, newCol)
}

function navDown () {
  updateCurrentBlock(store.currentBlockIndex.row + 1, store.currentBlockIndex.col)
}

function navLeft () {
  let newCol = store.currentBlockIndex.col - 1
  let newRow = store.currentBlockIndex.row
  if (store.currentBlockIndex.col === 0) {
    newCol = store.matrixCols - 1
    newRow--
  }
  
  updateCurrentBlock(newRow, newCol)
}

export default function useStore () {

  return {
    store,

    navUp,
    navRight,
    navDown,
    navLeft,

    updateCurrentBlock,
  }
}