export function parseGameGridString(gridString: string) {
  const [x, y] = gridString.split('x').map(el => Number(el))
  return { x, y }
}
