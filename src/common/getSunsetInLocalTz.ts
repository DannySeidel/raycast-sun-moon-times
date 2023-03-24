import { getSunset } from "sunrise-sunset-js"

export function getSunsetInLocalTz(lat: number, lon: number, timezone: string): string {
    const sunrise = getSunset(lat, lon)
    const tz = timezone === "America/Ciudad_Juarez" ? "America/Chihuahua" : timezone
    const options: Intl.DateTimeFormatOptions = {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
    }

    return sunrise.toLocaleString("default", options)
}
