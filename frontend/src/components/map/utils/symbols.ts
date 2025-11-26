import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'

export const simpleFillSymbol = new SimpleFillSymbol({
  color: [0, 68, 255, 0.18],
  outline: {
    type: 'simple-line',
    color: [51, 88, 212, 1],
    width: 2,
  },
  style: 'solid',
})
