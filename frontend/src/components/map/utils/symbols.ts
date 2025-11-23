import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'

export type RGBValue = [number, number, number, number]

export type BoundaryColor = {
  fill: RGBValue
  outline: RGBValue
}

export const DEFAULT_BOUNDARY_COLOR: BoundaryColor = {
  fill: [0, 68, 255, 0.18],
  outline: [51, 88, 212, 1],
}

export const simpleFillSymbol = new SimpleFillSymbol({
  color: DEFAULT_BOUNDARY_COLOR.fill,
  outline: {
    type: 'simple-line',
    color: DEFAULT_BOUNDARY_COLOR.outline,
    width: 2,
  },
  style: 'solid',
})
