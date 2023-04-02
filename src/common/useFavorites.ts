import { LocalStorage } from "@raycast/api"
import { useEffect, useState } from "react"
import { CityItem } from "../../types/CityItem"

export function useFavorites() {
    const [favorites, setFavorites] = useState<CityItem[]>([])

    useEffect(() => {
        async function getFavorites() {
            const favorites = await LocalStorage.getItem("favorites")
            console.log(favorites)
            if (favorites) {
                setFavorites(JSON.parse(favorites.toString()))
            }
        }

        getFavorites()
    }, [])

    return favorites
}
