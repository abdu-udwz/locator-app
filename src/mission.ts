import { reactive, unref, computed } from 'vue'
import type { LocatorBlock, LocatorMission  } from './types'

// stupidly measured but effective numbers ^_^
// TODO: make this ratio dynamic and take into account zoom levels other than 19
const lngToPixelRatio = 0.000002528
const latToPixelRatio = 0.00000205

function genEmptyMission (): LocatorMission {
  return {
    title: `New mission ${Date.now()}`,
    matrix: [],
    startPoint: [
      import.meta.env.VITE_DEFAULT_AREA_START_LAT ?? '32.00', 
      import.meta.env.VITE_DEFAULT_AREA_START_LNG ?? '15.00',
    ],
    endPoint: [
      import.meta.env.VITE_DEFAULT_AREA_END_LAT ?? '32.1', 
      import.meta.env.VITE_DEFAULT_AREA_END_LNG ?? '15.1'
    ],
  
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

  const blockWidth = viewportSize.width * lngToPixelRatio
  const blockHeight = viewportSize.height * latToPixelRatio

  const matrix: LocatorBlock[][] = []
  
  let currentRow =  parsedStartPoint[0]
  while (currentRow > parsedEndPoint[0]) {
    const blocksRow: LocatorBlock[] = []

    currentRow -= blockHeight
    let currentCol = parsedStartPoint[1]
    while (currentCol < parsedEndPoint[1]) {
      currentCol += blockWidth
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