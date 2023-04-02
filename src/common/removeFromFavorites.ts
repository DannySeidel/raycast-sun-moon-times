import { LocalStorage } from "@raycast/api"
import { CityItem } from "../../types/CityItem"

export async function removeFromFavorites(geonameId: number) {
    const savedFavorites = await LocalStorage.getItem("favorites")
    if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites.toString())
        if (favorites.some((favorite: CityItem) => favorite.geonameId === geonameId)) {
            const newFavorites = favorites.filter((favorite: CityItem) => favorite.geonameId !== geonameId)
            await LocalStorage.setItem("favorites", JSON.stringify(newFavorites))
        }
    }
}
