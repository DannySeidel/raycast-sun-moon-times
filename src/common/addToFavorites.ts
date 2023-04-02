import { LocalStorage, showToast, Toast } from "@raycast/api"
import { CityItem } from "../../types/CityItem"

export async function addToFavorites(cityInfo: CityItem) {
    const savedFavorites = await LocalStorage.getItem("favorites")
    if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites.toString())
        if (favorites.some((favorite: CityItem) => favorite.geonameId === cityInfo.geonameId)) {
            await showToast({
                style: Toast.Style.Failure,
                title: `${cityInfo.name} is already in your favorites`,
            })
        } else {
            favorites.push(cityInfo)
            await LocalStorage.setItem("favorites", JSON.stringify(favorites))
        }
    } else {
        await LocalStorage.setItem("favorites", JSON.stringify([cityInfo]))
    }
}
