import { reactive, computed } from 'vue'

type CoordinatePair = [number, number]


// stupidly measured but effective numbers ^_^
// each pixel sums up to 0.000002538 coordinate unit at zoom level 18
//
// TODO: make this ratio dynamic and take into account zoom levels other than 18
const mapToPixelRatio = 0.000002538

const store = reactive({
  zoom: 18,

  viewPort: {
    width: 100,
    height: 100,
  },

  blockWidth: computed((): number => store.viewPort.width * mapToPixelRatio),
  blockHeight: computed((): number => store.viewPort.height * mapToPixelRatio),

  currentBlock: {row: 0, col: 0},

  startPoint: ['32.32715235751756', '15.08581394993159'],
  endPoint: ['32.193612259300686', '15.138809048123479'],

  matrix: computed((): CoordinatePair[][] =>  {
    const parsedStartPoint = store.startPoint.map(parseFloat)
    const parsedEndPoint = store.endPoint.map(parseFloat)

    const result: CoordinatePair[][] = []
    
    let currentRow =  parsedStartPoint[0]
    while (currentRow > parsedEndPoint[0]) {
      const matrixRow: CoordinatePair[] = []

      currentRow -= store.blockWidth
      let currentCol = parsedStartPoint[1]
      while (currentCol < parsedEndPoint[1]) {
        currentCol += store.blockHeight
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