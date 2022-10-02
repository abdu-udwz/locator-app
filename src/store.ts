import { reactive, computed } from 'vue'

type CoordinatePair = [number, number]

const ROW_LENGTH = 0.0025;
const COL_LENGTH = 0.0025;

const store = reactive({
  currentBlock: {row: 0, col: 0},
  zoom: 18,

  startPoint: [32.32715235751756, 15.08581394993159],
  endPoint: [32.193612259300686, 15.138809048123479],

  matrix: computed((): CoordinatePair[][] =>  {
    const result: CoordinatePair[][] = []

    let currentRow = store.startPoint[0]
    while (currentRow > store.endPoint[0]) {
      
      const matrixRow: CoordinatePair[] = []

      currentRow -= ROW_LENGTH
      let currentCol = store.startPoint[1]

      while (currentCol < store.endPoint[1]) {
        currentCol += COL_LENGTH
        matrixRow.push([currentRow, currentCol])
      }

      result.push(matrixRow)
    }

    // const rows = Math.round((store.startPoint[0] - store.endPoint[0]) / 10)

    return result
  }),


  matrixRows:  computed((): number => store.matrix.length),

  matrixCols:  computed((): number => store.matrix[0].length),
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

  store.currentBlock = {row, col}
}

function navUp() {
  updateCurrentBlock(store.currentBlock.row - 1, store.currentBlock.col)
}


function navRight () {
  let newCol = store.currentBlock.col +1
  let newRow = store.currentBlock.row
  if (store.currentBlock.col === store.matrixCols - 1) {
    newCol = 0
    newRow++
  }

  updateCurrentBlock(newRow, newCol)
}

function navDown () {
  updateCurrentBlock(store.currentBlock.row + 1, store.currentBlock.col)
}

function navLeft () {
  let newCol = store.currentBlock.col - 1
  let newRow = store.currentBlock.row
  if (store.currentBlock.col === 0) {
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
    navLeft
  }
}