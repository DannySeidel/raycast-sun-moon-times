import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api"
import { getSunrise, getSunset } from "sunrise-sunset-js"
import { countryList } from "../../assets/countryList"
import { CityItem } from "../../types/CityItem"
import { addToFavorites } from "../common/addToFavorites"
import { convertDateToString } from "../common/convertDateToString"
import { getDayDuration } from "../common/getDayDuration"
import { resolveCoords } from "../common/resolveCoords"
import { DetailView } from "./DetailView"

export const CityListItemView = (city: CityItem) => {
    const { push } = useNavigation()
    const { geonameId, name, countryCode, timezone, coordinates } = city
    const sunrise = getSunrise(coordinates.lat, coordinates.lon)
    const sunset = getSunset(coordinates.lat, coordinates.lon)
    const dayDuration = getDayDuration(sunrise, sunset)
    const sunriseString = convertDateToString(sunrise, timezone)
    const sunsetString = convertDateToString(sunset, timezone)

    return (
        <List.Item
            key={geonameId}
            icon={{ source: countryList[countryCode].flag }}
            title={name}
            subtitle={resolveCoords(coordinates.lat, coordinates.lon)}
            accessories={[
                { icon: Icon.Sun },
                {
                    icon: Icon.ArrowUp,
                    text: sunriseString,
                },
                {
                    icon: Icon.ArrowDown,
                    text: sunsetString,
                },
                { icon: Icon.Clock, text: dayDuration },
            ]}
            actions={
                <ActionPanel>
                    <Action
                        title="Show More Infos"
                        icon={Icon.Info}
                        onAction={() =>
                            push(
                                <DetailView
                                    geonameId={geonameId}
                                    name={name}
                                    countryCode={countryCode}
                                    timezone={timezone}
                                    coordinates={coordinates}
                                    sunrise={sunriseString}
                                    sunset={sunsetString}
                                    dayDuration={dayDuration}
                                />
                            )
                        }
                    />
                    <Action
                        title="Add to Favorites"
                        icon={Icon.Star}
                        onAction={async () => await addToFavorites(city)}
                    />
                </ActionPanel>
            }
        />
    )
}
