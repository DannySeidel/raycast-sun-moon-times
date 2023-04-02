import { LocalStorage } from "@raycast/api"
import { CityItem } from "../../types/CityItem"

export async function addToFavorites(cityInfo: CityItem) {
    const savedFavorites = await LocalStorage.getItem("favorites")
    if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites.toString())
        console.log(favorites)
        console.log(cityInfo)
        if (!favorites.some((favorite: CityItem) => favorite.geoname_id === cityInfo.geoname_id)) {
            favorites.push(cityInfo)
            await LocalStorage.setItem("favorites", JSON.stringify(favorites))
        }
        // TODO: if in favorites show info
    } else {
        await LocalStorage.setItem("favorites", JSON.stringify([cityInfo]))
    }
}
