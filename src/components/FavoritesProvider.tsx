import { LocalStorage, showToast, Toast } from "@raycast/api"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { countryList } from "../../assets/countryList"
import { CityItem } from "../../types/CityItem"

interface FavoritesContextProps {
    favorites: CityItem[]
    addToFavorites: (cityInfo: CityItem) => Promise<void>
    removeFromFavorites: (cityInfo: CityItem) => Promise<void>
}

interface FavoritesProviderProps {
    children?: ReactNode
}

const initialFavoritesContext: FavoritesContextProps = {
    favorites: [],
    addToFavorites: () => new Promise(() => Promise<object>),
    removeFromFavorites: () => new Promise(() => Promise<object>),
}

const FavoritesContext = createContext<FavoritesContextProps>(initialFavoritesContext)

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    const [favorites, setFavorites] = useState<CityItem[]>(initialFavoritesContext.favorites)

    useEffect(() => {
        async function getFavorites() {
            const favorites = await LocalStorage.getItem("favorites")
            if (favorites) {
                setFavorites(JSON.parse(favorites.toString()))
            }
        }

        getFavorites()
    }, [])

    async function addToFavorites(cityInfo: CityItem): Promise<void> {
        if (favorites.some((favorite: CityItem) => favorite.geonameId === cityInfo.geonameId)) {
            await showToast({
                style: Toast.Style.Failure,
                title: `${countryList[cityInfo.countryCode].flag} ${cityInfo.name} is already in your favorites`,
            })
        } else {
            const newFavorites = [...favorites, cityInfo]
            setFavorites(newFavorites)
            await LocalStorage.setItem("favorites", JSON.stringify(newFavorites))
            await showToast({
                style: Toast.Style.Success,
                title: `${countryList[cityInfo.countryCode].flag} ${cityInfo.name} was add to your favorites`,
            })
        }
    }

    async function removeFromFavorites(cityInfo: CityItem): Promise<void> {
        if (favorites.some((favorite: CityItem) => favorite.geonameId === cityInfo.geonameId)) {
            const newFavorites = favorites.filter((favorite: CityItem) => favorite.geonameId !== cityInfo.geonameId)
            setFavorites(newFavorites)
            await LocalStorage.setItem("favorites", JSON.stringify(newFavorites))
            await showToast({
                style: Toast.Style.Success,
                title: `${countryList[cityInfo.countryCode].flag} ${cityInfo.name} was removed from your favorites`,
            })
        }
    }

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider")
    }
    return context
}
