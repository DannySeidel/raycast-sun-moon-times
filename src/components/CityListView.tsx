import { List } from "@raycast/api"
import { useFetch } from "@raycast/utils"
import { useState } from "react"
import { ressourceUrl } from "../../assets/ressourceUrl"
import { ResponseData } from "../../types/ResponseData"
import { useFavorites } from "../common/useFavorites"
import { CityListItemView } from "./CityListItemView"

export const CityListView = () => {
    const [searchText, setSearchText] = useState<string>("")
    const { isLoading, data } = useFetch<ResponseData>(ressourceUrl(searchText))

    const favorites = useFavorites()

    return (
        <List isLoading={isLoading} onSearchTextChange={setSearchText}>
            {searchText.length === 0 ? (
                <List.Section title="Favorites">
                    {favorites.map((city) => {
                        const { geoname_id, name, country_code, timezone, coordinates } = city
                        return (
                            <CityListItemView
                                geoname_id={geoname_id}
                                name={name}
                                country_code={country_code}
                                timezone={timezone}
                                coordinates={coordinates}
                            />
                        )
                    })}
                </List.Section>
            ) : (
                data?.records.map(({ record: { fields: city } }) => {
                    const { geoname_id, name, country_code, timezone, coordinates } = city
                    return (
                        <CityListItemView
                            geoname_id={geoname_id}
                            name={name}
                            country_code={country_code}
                            timezone={timezone}
                            coordinates={coordinates}
                        />
                    )
                })
            )}
        </List>
    )
}
