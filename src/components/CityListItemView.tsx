import { Action, ActionPanel, Icon, List, useNavigation } from "@raycast/api"
import { getSunrise, getSunset } from "sunrise-sunset-js"
import { countryList } from "../../assets/countryList"
import { CityItem } from "../../types/CityItem"
import { convertDateToString } from "../common/convertDateToString"
import { getDayDuration } from "../common/getDayDuration"
import { resolveCoords } from "../common/resolveCoords"
import { DetailView } from "./DetailView"
import { useFavorites } from "./FavoritesProvider"

interface CityListItemViewProps extends CityItem {
    isFavorite?: boolean
}

export const CityListItemView = ({
    geonameId,
    name,
    countryCode,
    timezone,
    coordinates,
    isFavorite,
}: CityListItemViewProps) => {
    const { push } = useNavigation()
    const city = { geonameId, name, countryCode, timezone, coordinates }
    const sunrise = getSunrise(coordinates.lat, coordinates.lon)
    const sunset = getSunset(coordinates.lat, coordinates.lon)
    const dayDuration = getDayDuration(sunrise, sunset)
    const sunriseString = convertDateToString(sunrise, timezone)
    const sunsetString = convertDateToString(sunset, timezone)

    const { addToFavorites, removeFromFavorites } = useFavorites()

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
                    {isFavorite ? (
                        <Action
                            title="Remove From Favorites"
                            style={Action.Style.Destructive}
                            icon={Icon.Trash}
                            onAction={async () => await removeFromFavorites(city)}
                        />
                    ) : (
                        <Action
                            title="Add to Favorites"
                            icon={Icon.Star}
                            onAction={async () => await addToFavorites(city)}
                        />
                    )}
                </ActionPanel>
            }
        />
    )
}
