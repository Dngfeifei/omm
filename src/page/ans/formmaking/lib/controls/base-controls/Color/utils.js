
export function rgba2color(rgba) {
  if (!rgba) {
    return {
      color: '#ffffff',
      alpha: 100,
    }
  }
  var str = rgba.substring(rgba.indexOf('(') + 1, rgba.indexOf(')'))
  var tokens = str.split(',').map(d => {
    return +d.trim()
  })

  var color = {
    color: '#' + tokens[0].toString(16) + tokens[1].toString(16) + tokens[2].toString(16),
    alpha: tokens[3] * 100
  }
  return color
}


export function color2rgba(color) {
  var r = parseInt(color.color.substring(1, 3), 16)
  var g = parseInt(color.color.substring(3, 5), 16)
  var b = parseInt(color.color.substring(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${color.alpha / 100})`
}
