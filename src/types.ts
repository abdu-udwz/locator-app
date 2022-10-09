export type CoordinatesPair = [number, number]


export interface LocatorBlock {
  coordinates: CoordinatesPair

  visited: boolean
  priority: 0 | 1 | 2 | 3 | 4

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