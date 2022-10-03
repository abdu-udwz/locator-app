export type CoordinatesPair = [number, number]


export interface LocatorBlock {
  coordinates: CoordinatesPair

  visited: boolean
  highlight: 'NONE' | 'FAVORITE' | 'IGNORED'

  note: string
}