import { useState } from "react"
import { useSQL } from "@raycast/utils"
import { CITIES_DB } from "../../config/dbPath"
import { getDbQuery } from "../common/getDbQuery"
import { List } from "@raycast/api"
import { countryList } from "../../assets/countryList"
import { resolveCoords } from "../common/resolveCoords"
import { getSunriseInLocalTz } from "../common/getSunriseInLocalTz"
import { getSunsetInLocalTz } from "../common/getSunsetInLocalTz"

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
                return (
                    <List.Item
                        key={id}
                        title={`${countryList[country].emoji}  ${name}`}
                        subtitle={resolveCoords(lat, lon)}
                        accessories={[
                            { text: "☀️" },
                            {
                                icon: "arrow-up-16",
                                text: getSunriseInLocalTz(lat, lon, timezone),
                            },
                            { icon: "arrow-down-16", text: getSunsetInLocalTz(lat, lon, timezone) },
                        ]}
                    />
                )
            })}
        </List>
    )
}
