import { reactive, unref, computed } from 'vue'
import type { LocatorBlock, LocatorMission  } from './types'

// stupidly measured but effective numbers ^_^
// each pixel sums up to 0.000002538 coordinate unit at zoom level 19
//
// TODO: make this ratio dynamic and take into account zoom levels other than 19
const mapToPixelRatio = 0.000002538

function genEmptyMission (): LocatorMission {
  return {
    title: `New mission ${Date.now()}`,
    matrix: [],
    startPoint: ['32.32715235751756', '15.08581394993159'],
    endPoint: ['32.193612259300686', '15.138809048123479'],
  
    currentBlockIndex: {row: 0, col:  0},
  }
}

const missionStore = reactive({
  missions: [] as Array<{ id: string, title: string }>,

  internalMissionKey: '',
  missionKey: computed({
    set(newKey: string) {
      if (missionStore.internalMissionKey) {
        saveMission(missionStore.mission)
      }

      missionStore.internalMissionKey = newKey
      loadMission(newKey)
    },
    get (): string {
      return missionStore.internalMissionKey
    }
  }),

  mission: genEmptyMission() as LocatorMission,

  dialog: {
    visible: false,
    regenerateMatrix: false,
    newMission: false,
    mission: genEmptyMission() as LocatorMission,
  }
})

/*
 * Missions' list
 */
function updateMissionsList () {
  const data = 
    Object.keys(localStorage).filter((itemKey) => itemKey.startsWith('$mission-')).map((item) => {
      return { id: item, title: item.substring(9) }
    })

  missionStore.missions = data
}

/* 
 * blocks' matrix
 */
function generateBlocksMatrix (
  area: Pick<LocatorMission, 'startPoint' | 'endPoint'>,
  viewportSize: {width: number, height: number}
   ): LocatorBlock[][] {
  const parsedStartPoint = area.startPoint.map(parseFloat)
  const parsedEndPoint = area.endPoint.map(parseFloat)

  const blockWidth = viewportSize.width * mapToPixelRatio
  const blockHeight = viewportSize.height * mapToPixelRatio

  const matrix: LocatorBlock[][] = []
  
  let currentRow =  parsedStartPoint[0]
  while (currentRow > parsedEndPoint[0]) {
    const blocksRow: LocatorBlock[] = []

    currentRow -= blockWidth
    let currentCol = parsedStartPoint[1]
    while (currentCol < parsedEndPoint[1]) {
      currentCol += blockHeight
      blocksRow.push({
        coordinates: [currentRow, currentCol],
        visited: false,
        priority: 0,
        note: '',
      })
    }

    matrix.push(blocksRow)
  }

  return matrix
}

function loadMission (missionKey: string): void {
  missionStore.mission = JSON.parse(localStorage.getItem(missionKey)!)
}

function saveMission (mission: LocatorMission): void {
  localStorage.setItem(`$mission-${mission.title}`, JSON.stringify(unref(mission)))
}

function showNewDialog () {
  missionStore.dialog.mission = genEmptyMission()
  missionStore.dialog.newMission = true
  missionStore.dialog.regenerateMatrix = true
  missionStore.dialog.visible = true
}

export default function useMission () {
  return {
    missionStore,

    generateBlocksMatrix,

    showNewDialog,

    saveMission,

    updateMissionsList,
  }
}

/*
 * a prototype, simple periodic auto save
 */
setInterval(() => {
  if (missionStore.internalMissionKey) {
    saveMission(missionStore.mission)
    // console.info('[MissionState]: automatically stored changes (or no changes).')
  }
}, 15 * 1000)