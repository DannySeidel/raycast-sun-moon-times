import { LocalStorage } from "@raycast/api"
import { CityItem } from "../../types/CityItem"

export async function addToFavorites(cityInfo: CityItem) {
    const savedFavorites = await LocalStorage.getItem("favorites")
    if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites.toString())
        if (favorites.some((favorite: CityItem) => favorite.geonameId === cityInfo.geonameId)) {
            // TODO: if in favorites show info
        } else {
            favorites.push(cityInfo)
            await LocalStorage.setItem("favorites", JSON.stringify(favorites))
        }
    } else {
        await LocalStorage.setItem("favorites", JSON.stringify([cityInfo]))
    }
}
