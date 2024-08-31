export function parseGameGridString(gridString) {
    const [x, y] = gridString.split('x').map(el => Number(el))
    return {x, y};
}