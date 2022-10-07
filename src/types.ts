export type CoordinatesPair = [number, number]


export interface LocatorBlock {
  coordinates: CoordinatesPair

  visited: boolean
  highlight: 'NONE' | 'FAVORITE' | 'IGNORED'

  note: string
}

export interface LocatorMission {
  title: string

  startPoint: [string, string]
  endPoint: [string, string]

  matrix: LocatorBlock[][]
  currentBlockIndex: {
    row: number 
    col: number
  }
}