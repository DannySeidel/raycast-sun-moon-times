import { Action, ActionPanel, List } from "@raycast/api"
import { useSQL } from "@raycast/utils"
import { useState } from "react"
import { getSunrise, getSunset } from "sunrise-sunset-js"
import { countryList } from "../../assets/countryList"
import { dbPath } from "../../config/dbPath"
import { CityItem } from "../../types/CityItem"
import { convertDateToString } from "../common/convertDateToString"
import { getDayDuration } from "../common/getDayDuration"
import { getDbQuery } from "../common/getDbQuery"
import { resolveCoords } from "../common/resolveCoords"
import { DetailView } from "./DetailView"

export const CityListView = () => {
    const [searchText, setSearchText] = useState<string>("")
    const { permissionView, data, isLoading } = useSQL<CityItem>(dbPath, getDbQuery(searchText))

    if (permissionView) {
        return permissionView
    }

    return (
        <List isLoading={isLoading} onSearchTextChange={setSearchText}>
            {data?.map((city) => {
                const { id, name, country, timezone, lat, lon } = city
                const sunrise = getSunrise(lat, lon)
                const sunset = getSunset(lat, lon)
                const dayDuration = getDayDuration(sunrise, sunset)
                const sunriseString = convertDateToString(sunrise, timezone)
                const sunsetString = convertDateToString(sunset, timezone)

                return (
                    <List.Item
                        key={id}
                        icon={{ source: countryList[country].flag }}
                        title={name}
                        subtitle={resolveCoords(lat, lon)}
                        accessories={[
                            { icon: "sun-16" },
                            {
                                icon: "arrow-up-16",
                                text: sunriseString,
                            },
                            {
                                icon: "arrow-down-16",
                                text: sunsetString,
                            },
                            { icon: "clock-16", text: dayDuration },
                        ]}
                        actions={
                            <ActionPanel>
                                <Action.Push
                                    title="Show More Infos"
                                    target={
                                        <DetailView
                                            name={name}
                                            country={country}
                                            timezone={timezone}
                                            lat={lat}
                                            lon={lon}
                                            sunrise={sunriseString}
                                            sunset={sunsetString}
                                            dayDuration={dayDuration}
                                        />
                                    }
                                />
                            </ActionPanel>
                        }
                    />
                )
            })}
        </List>
    )
}
