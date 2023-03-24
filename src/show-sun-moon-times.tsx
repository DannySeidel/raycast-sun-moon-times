import { List } from "@raycast/api"
import { useSQL } from "@raycast/utils"
import { useState } from "react"
import { CITIES_DB } from "../config/dbPath"
import { getDbQuery } from "./common/getDbQuery"

interface cityItem {
    id: number
    name: string
    lon: number
    lat: number
}

export default function Command() {
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
                    title={city.name}
                    subtitle={`Lon: ${city.lon.toFixed(2)}, Lat: ${city.lat.toFixed(2)}`}
                />
            ))}
        </List>
    )
}
