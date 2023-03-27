import { List } from "@raycast/api"
import { useSQL } from "@raycast/utils"
import { useState } from "react"
import { getSunrise, getSunset } from "sunrise-sunset-js"
import { countryList } from "../../assets/countryList"
import { CITIES_DB } from "../../config/dbPath"
import { convertDateToString } from "../common/convertDateToString"
import { getDayDuration } from "../common/getDayDuration"
import { getDbQuery } from "../common/getDbQuery"
import { resolveCoords } from "../common/resolveCoords"

interface cityItem {
    id: number
    name: string
    country: string
    timezone: string
    lon: number
    lat: number
}

export const CountryList = () => {
    const [searchText, setSearchText] = useState<string>("")
    const { permissionView, data, isLoading } = useSQL<cityItem>(CITIES_DB, getDbQuery(searchText))

    if (permissionView) {
        return permissionView
    }

    return (
        <List isLoading={isLoading} onSearchTextChange={setSearchText}>
            {data?.map((city) => {
                const { id, name, country, timezone, lon, lat } = city
                const sunrise = getSunrise(lat, lon)
                const sunset = getSunset(lat, lon)
                const dayDuration = getDayDuration(sunrise, sunset)

                return (
                    <List.Item
                        key={id}
                        title={`${countryList[country].emoji}  ${name}`}
                        subtitle={resolveCoords(lat, lon)}
                        accessories={[
                            { icon: "sun-16" },
                            {
                                icon: "arrow-up-16",
                                text: convertDateToString(sunrise, timezone),
                            },
                            {
                                icon: "arrow-down-16",
                                text: convertDateToString(sunset, timezone),
                            },
                            { icon: "clock-16", text: dayDuration },
                        ]}
                    />
                )
            })}
        </List>
    )
}
