import { useState } from "react"
import { useSQL } from "@raycast/utils"
import { CITIES_DB } from "../../config/dbPath"
import { getDbQuery } from "../common/getDbQuery"
import { List } from "@raycast/api"
import { countryList } from "../../assets/countryList"
import { resolveCoords } from "../common/resolveCoords"

interface cityItem {
    id: number
    name: string
    country: string
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
            {data?.map((city) => (
                <List.Item
                    key={city.id}
                    title={`${countryList[city.country].emoji}  ${city.name}`}
                    subtitle={resolveCoords(city.lat, city.lon)}
                    accessories={[{ text: countryList[city.country]["name"] }]}
                />
            ))}
        </List>
    )
}
