export function resolveCoords(lat: number, lon: number): string {
    const latOrientation = lat < 0 ? "S" : "N"
    const lonOrientation = lon < 0 ? "W" : "E"

    return `${latOrientation} ${lat.toFixed(2)}, ${lonOrientation} ${lon.toFixed(2)}`
}
