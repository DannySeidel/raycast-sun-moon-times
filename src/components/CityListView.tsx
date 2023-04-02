import { Action, ActionPanel, List } from "@raycast/api"
import { useFetch } from "@raycast/utils"
import { useState } from "react"
import { getSunrise, getSunset } from "sunrise-sunset-js"
import { countryList } from "../../assets/countryList"
import { ressourceUrl } from "../../assets/ressourceUrl"
import { CityData } from "../../types/CityData"
import { convertDateToString } from "../common/convertDateToString"
import { getDayDuration } from "../common/getDayDuration"
import { resolveCoords } from "../common/resolveCoords"
import { DetailView } from "./DetailView"

export const CityListView = () => {
    const [searchText, setSearchText] = useState<string>("")
    const { isLoading, data } = useFetch<CityData>(ressourceUrl(searchText))

    return (
        <List isLoading={isLoading} onSearchTextChange={setSearchText}>
            {searchText.length === 0 ? (
                // TODO show favorite cities
                <></>
            ) : (
                data?.records.map(({ record: { fields: city } }) => {
                    const { geoname_id, name, country_code, timezone, coordinates } = city
                    const sunrise = getSunrise(coordinates.lat, coordinates.lon)
                    const sunset = getSunset(coordinates.lat, coordinates.lon)
                    const dayDuration = getDayDuration(sunrise, sunset)
                    const sunriseString = convertDateToString(sunrise, timezone)
                    const sunsetString = convertDateToString(sunset, timezone)

                    return (
                        <List.Item
                            key={geoname_id}
                            icon={{ source: countryList[country_code].flag }}
                            title={name}
                            subtitle={resolveCoords(coordinates.lat, coordinates.lon)}
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
                                                country={country_code}
                                                timezone={timezone}
                                                lat={coordinates.lat}
                                                lon={coordinates.lon}
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
                })
            )}
        </List>
    )
}
